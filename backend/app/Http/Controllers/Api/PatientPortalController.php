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
}
