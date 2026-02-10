<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\PatientOtp;
use App\Models\SecureLink;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PatientPortalController extends Controller
{

    public function getReports(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $patient = Patient::where('email', $user->email)->first();
        if (!$patient) return response()->json(['error' => 'Patient record not found.'], 404);

        // Fetch Reports (Lab & Radiology)
        // Filter by 'finalized' status and 'paid' status (Strict Requirement)
        // For now, we simulate finding finalized results.

        // Lab Results linked to Patient
        // Need to traverse: Patient -> Visits -> LabOrders -> LabResults
        // Simplified for Phase 6: We will assume we can query LabResults by valid joins.

        return response()->json(['message' => 'Reports fetched', 'data' => []]);
    }

    public function generateSecureLink(Request $request)
    {
        // Admin/System generates this for SMS
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'resource_type' => 'required',
            'resource_id' => 'required'
        ]);

        $token = Str::random(32);

        $link = SecureLink::create([
            'patient_id' => $validated['patient_id'],
            'resource_type' => $validated['resource_type'],
            'resource_id' => $validated['resource_id'],
            'token' => $token,
            'expires_at' => now()->addDays(7)
        ]);

        return response()->json(['link' => url("/api/patient/download/{$token}")]);
    }

    public function downloadSecure(Request $request, $token)
    {
        $link = SecureLink::where('token', $token)
            ->where('expires_at', '>', now())
            ->firstOrFail();

        // Validate Payment Status Here (Strict Requirement)
        // Check if Bill associated with this resource is Paid.

        $link->increment('access_count');

        return response()->json(['content' => "Secure Content for {$link->resource_type} {$link->resource_id}"]);
    }

    public function getDashboardData(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $patient = Patient::where('email', $user->email)->first();

        if (!$patient) {
            return response()->json(['error' => 'Patient record not found.'], 404);
        }

        // Fetch Real Appointments
        $appointments = \App\Models\Appointment::with(['doctor.user', 'doctor.department'])
            ->where('patient_id', $patient->id)
            ->where('appointment_date', '>=', now()) // only upcoming/recent? or all? Requirements say "expected data". Usually dashboard shows upcoming.
            ->orderBy('appointment_date', 'asc')
            ->limit(5)
            ->get()
            ->map(function ($appt) {
                $appt->department = $appt->doctor->department;
                return $appt;
            });

        // Fetch Real Prescriptions
        $prescriptions = \App\Models\Prescription::with('doctor.user')
            ->where('patient_id', $patient->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Fetch Real Reports (Lab & Radiology)
        // Lab
        $labResults = \App\Models\LabResult::whereHas('visit', function ($q) use ($patient) {
            $q->where('patient_id', $patient->id);
        })
            ->with(['test', 'visit.doctor.user'])
            ->whereNotNull('finalized_at')
            ->orderBy('finalized_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($result) {
                return [
                    'date' => Carbon::parse($result->finalized_at)->format('Y-m-d'),
                    'type' => 'Lab',
                    'description' => $result->test->name ?? 'Lab Test',
                    'doctor' => $result->visit->doctor->user->name ?? 'Unknown',
                    'id' => $result->id
                ];
            });

        // Radiology
        $radiologyResults = \App\Models\RadiologyResult::whereHas('study.visit', function ($q) use ($patient) {
            $q->where('patient_id', $patient->id);
        })
            ->with(['study', 'radiologist'])
            ->whereNotNull('finalized_at')
            ->orderBy('finalized_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($result) {
                return [
                    'date' => Carbon::parse($result->finalized_at)->format('Y-m-d'),
                    'type' => 'Radiology',
                    'description' => $result->study->study_name ?? 'Radiology Scan',
                    'doctor' => $result->radiologist->name ?? 'Unknown', // radiologist is a User
                    'id' => $result->id
                ];
            });

        // Merge and Sort Reports
        $reports = $labResults->merge($radiologyResults)->sortByDesc('date')->values()->take(5);

        return response()->json([
            'patient' => [
                'name' => $patient->name,
                'dob' => $patient->dob ? $patient->dob->format('Y-m-d') : null,
                'blood_type' => $patient->blood_group, // frontend expects blood_type, model has blood_group
                'phone' => $patient->phone,
                'email' => $patient->email,
                'address' => $patient->address
            ],
            'appointments' => $appointments,
            'reports' => $reports,
            'prescriptions' => $prescriptions
        ]);
    }

    /**
     * Get patient's appointments (all, not just upcoming)
     */
    public function getAppointments(Request $request)
    {
        $user = $request->user();
        $patient = Patient::where('email', $user->email)->first();
        if (!$patient) {
            return response()->json(['error' => 'Patient record not found.'], 404);
        }

        $query = \App\Models\Appointment::with(['doctor.user', 'doctor.department'])
            ->where('patient_id', $patient->id)
            ->orderBy('appointment_date', 'desc');

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $appointments = $query->paginate(20);

        $appointments->getCollection()->transform(function ($appt) {
            return [
                'id' => $appt->id,
                'appointment_number' => $appt->appointment_number ?? null,
                'doctor_name' => $appt->doctor?->user?->name ?? 'Doctor',
                'department' => $appt->doctor?->department?->name ?? 'N/A',
                'specialization' => $appt->doctor?->specialization ?? 'N/A',
                'appointment_date' => $appt->appointment_date,
                'status' => $appt->status,
                'symptoms' => $appt->symptoms,
                'can_cancel' => in_array($appt->status, ['pending', 'confirmed']),
            ];
        });

        return response()->json($appointments);
    }

    /**
     * Cancel a patient's appointment
     */
    public function cancelAppointment(Request $request, $id)
    {
        $user = $request->user();
        $patient = Patient::where('email', $user->email)->first();
        if (!$patient) {
            return response()->json(['error' => 'Patient record not found.'], 404);
        }

        $appointment = \App\Models\Appointment::where('id', $id)
            ->where('patient_id', $patient->id)
            ->firstOrFail();

        if (!in_array($appointment->status, ['pending', 'confirmed'])) {
            return response()->json([
                'message' => 'This appointment cannot be cancelled. Only pending or confirmed appointments can be cancelled.'
            ], 422);
        }

        // Check if billing has started
        $visit = \App\Models\Visit::where('appointment_id', $appointment->id)->first();
        if ($visit) {
            $bill = \App\Models\Bill::where('visit_id', $visit->id)->first();
            if ($bill && $bill->status !== 'draft') {
                return response()->json([
                    'message' => 'Cannot cancel appointment - billing has already been processed.'
                ], 422);
            }
        }

        $appointment->status = 'cancelled';
        $appointment->save();

        return response()->json(['message' => 'Appointment cancelled successfully']);
    }

    /**
     * Get patient's prescriptions
     */
    public function getPrescriptions(Request $request)
    {
        $user = $request->user();
        $patient = Patient::where('email', $user->email)->first();
        if (!$patient) {
            return response()->json(['error' => 'Patient record not found.'], 404);
        }

        $prescriptions = \App\Models\Prescription::with(['doctor.user'])
            ->where('patient_id', $patient->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $prescriptions->getCollection()->transform(function ($rx) {
            $medications = $rx->medications;
            if (is_string($medications)) {
                $medications = json_decode($medications, true) ?? [];
            }

            return [
                'id' => $rx->id,
                'doctor_name' => $rx->doctor?->user?->name ?? 'Doctor',
                'diagnosis' => $rx->diagnosis ?? null,
                'medications' => $medications,
                'notes' => $rx->notes,
                'follow_up_date' => $rx->follow_up_date,
                'created_at' => $rx->created_at,
            ];
        });

        return response()->json($prescriptions);
    }

    /**
     * Get patient's medical records (lab results + radiology)
     */
    public function getRecords(Request $request)
    {
        $user = $request->user();
        $patient = Patient::where('email', $user->email)->first();
        if (!$patient) {
            return response()->json(['error' => 'Patient record not found.'], 404);
        }

        // Lab Results
        $labResults = \App\Models\LabResult::whereHas('visit', function ($q) use ($patient) {
            $q->where('patient_id', $patient->id);
        })
            ->with(['test', 'visit.doctor.user'])
            ->whereNotNull('finalized_at')
            ->orderBy('finalized_at', 'desc')
            ->get()
            ->map(function ($result) {
                return [
                    'id' => $result->id,
                    'date' => Carbon::parse($result->finalized_at)->format('Y-m-d'),
                    'name' => $result->test->name ?? 'Lab Test',
                    'type' => 'Lab Report',
                    'doctor' => $result->visit->doctor->user->name ?? 'Unknown',
                    'status' => $result->status,
                    'resource_type' => 'lab_result',
                ];
            });

        // Radiology Results
        $radiologyResults = \App\Models\RadiologyResult::whereHas('study.visit', function ($q) use ($patient) {
            $q->where('patient_id', $patient->id);
        })
            ->with(['study', 'radiologist'])
            ->whereNotNull('finalized_at')
            ->orderBy('finalized_at', 'desc')
            ->get()
            ->map(function ($result) {
                return [
                    'id' => $result->id,
                    'date' => Carbon::parse($result->finalized_at)->format('Y-m-d'),
                    'name' => $result->study->study_name ?? 'Radiology Scan',
                    'type' => 'Radiology Report',
                    'doctor' => $result->radiologist->name ?? 'Unknown',
                    'status' => 'finalized',
                    'resource_type' => 'radiology_result',
                ];
            });

        $records = $labResults->merge($radiologyResults)->sortByDesc('date')->values();

        return response()->json($records);
    }

    /**
     * Get patient profile
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();
        $patient = Patient::where('email', $user->email)->first();
        if (!$patient) {
            return response()->json(['error' => 'Patient record not found.'], 404);
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
            'patient' => [
                'id' => $patient->id,
                'uhid' => $patient->uhid,
                'name' => $patient->name,
                'dob' => $patient->dob,
                'gender' => $patient->gender,
                'phone' => $patient->phone,
                'email' => $patient->email,
                'address' => $patient->address,
                'blood_type' => $patient->blood_group,
            ],
        ]);
    }

    /**
     * Update patient profile (limited fields)
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $patient = Patient::where('email', $user->email)->first();
        if (!$patient) {
            return response()->json(['error' => 'Patient record not found.'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string|max:500',
            'current_password' => 'required_with:new_password|string',
            'new_password' => 'sometimes|string|min:8|confirmed',
        ]);

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
            $patient->name = $validated['name'];
        }
        if (isset($validated['phone'])) {
            $user->phone = $validated['phone'];
            $patient->phone = $validated['phone'];
        }
        if (isset($validated['address'])) {
            $patient->address = $validated['address'];
        }

        // Password change
        if (isset($validated['current_password']) && isset($validated['new_password'])) {
            if (!\Illuminate\Support\Facades\Hash::check($validated['current_password'], $user->password)) {
                return response()->json(['message' => 'Current password is incorrect'], 422);
            }
            $user->password = \Illuminate\Support\Facades\Hash::make($validated['new_password']);
        }

        $user->save();
        $patient->save();

        return response()->json(['message' => 'Profile updated successfully']);
    }
}
