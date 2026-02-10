<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admission;
use App\Models\VitalSign;
use App\Models\NursingNote;
use App\Models\User;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class NursePortalController extends Controller
{
    /**
     * Get nurse dashboard summary data
     */
    public function getDashboardData(Request $request)
    {
        $user = $request->user();

        // Get currently admitted patients (nurse sees all admitted patients)
        $admissions = Admission::with(['patient', 'bed.ward', 'doctor.user'])
            ->where('status', 'admitted')
            ->get();

        $totalPatients = $admissions->count();

        // Count pending vitals (admissions without vitals in last 4 hours)
        $fourHoursAgo = now()->subHours(4);
        $pendingVitals = $admissions->filter(function ($admission) use ($fourHoursAgo) {
            $lastVital = VitalSign::where('admission_id', $admission->id)
                ->orderBy('recorded_at', 'desc')
                ->first();
            return !$lastVital || $lastVital->recorded_at < $fourHoursAgo;
        })->count();

        // Recent vitals
        $recentVitals = VitalSign::with(['admission.patient'])
            ->orderBy('recorded_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($vital) {
                return [
                    'id' => $vital->id,
                    'patient_name' => $vital->admission?->patient?->name ?? 'Unknown',
                    'admission_id' => $vital->admission_id,
                    'bp' => ($vital->bp_systolic && $vital->bp_diastolic) ? "{$vital->bp_systolic}/{$vital->bp_diastolic}" : 'N/A',
                    'temperature' => $vital->temperature ? number_format($vital->temperature, 1) . '°F' : 'N/A',
                    'pulse' => $vital->pulse ? "{$vital->pulse} bpm" : 'N/A',
                    'spo2' => $vital->spo2 ? "{$vital->spo2}%" : 'N/A',
                    'respiratory_rate' => $vital->respiratory_rate ?? 'N/A',
                    'recorded_at' => $vital->recorded_at,
                    'time_ago' => $vital->recorded_at ? $vital->recorded_at->diffForHumans() : 'N/A',
                ];
            });

        // Assigned patients with latest vitals info
        $patients = $admissions->map(function ($admission) use ($fourHoursAgo) {
            $lastVital = VitalSign::where('admission_id', $admission->id)
                ->orderBy('recorded_at', 'desc')
                ->first();

            $vitalsDue = !$lastVital || $lastVital->recorded_at < $fourHoursAgo;

            return [
                'id' => $admission->id,
                'patient_name' => $admission->patient?->name ?? 'Unknown',
                'patient_id' => $admission->patient_id,
                'bed_number' => $admission->bed?->bed_number ?? 'N/A',
                'ward' => $admission->bed?->ward?->name ?? 'N/A',
                'doctor' => $admission->doctor?->user?->name ?? 'N/A',
                'admission_date' => $admission->admission_date,
                'status' => $admission->status,
                'vitals_status' => $vitalsDue ? 'due' : 'completed',
                'last_vitals' => $lastVital ? $lastVital->recorded_at->diffForHumans() : 'Never',
            ];
        });

        // Get employee info for shift
        $employee = Employee::where('user_id', $user->id)->with('shift')->first();
        $shiftEnds = $employee?->shift?->end_time ?? 'N/A';

        return response()->json([
            'stats' => [
                'assigned_patients' => $totalPatients,
                'pending_vitals' => $pendingVitals,
                'tasks_completed' => 0, // Will be implemented with task model
                'tasks_total' => 0,
                'shift_ends' => $shiftEnds,
            ],
            'patients' => $patients,
            'recent_vitals' => $recentVitals,
        ]);
    }

    /**
     * Get list of patients under nurse's care (from admissions)
     */
    public function getPatients(Request $request)
    {
        $query = Admission::with(['patient', 'bed.ward', 'doctor.user'])
            ->where('status', 'admitted');

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('patient', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        if ($request->has('ward_id')) {
            $query->whereHas('bed', function ($q) use ($request) {
                $q->where('ward_id', $request->ward_id);
            });
        }

        $admissions = $query->get();

        $patients = $admissions->map(function ($admission) {
            $lastVital = VitalSign::where('admission_id', $admission->id)
                ->orderBy('recorded_at', 'desc')
                ->first();

            // Determine status based on conditions
            $status = 'stable';
            if ($lastVital) {
                if (($lastVital->bp_systolic && $lastVital->bp_systolic > 180) ||
                    ($lastVital->spo2 && $lastVital->spo2 < 90) ||
                    ($lastVital->temperature && $lastVital->temperature > 103)) {
                    $status = 'critical';
                }
            }

            return [
                'id' => $admission->id,
                'patient_id' => $admission->patient_id,
                'name' => $admission->patient?->name ?? 'Unknown',
                'age' => $admission->patient?->dob ? now()->diffInYears($admission->patient->dob) : null,
                'gender' => $admission->patient?->gender ?? 'N/A',
                'ward' => $admission->bed?->ward?->name ?? 'N/A',
                'bed_number' => $admission->bed?->bed_number ?? 'N/A',
                'condition' => $admission->diagnosis ?? 'Under observation',
                'status' => $status,
                'doctor' => $admission->doctor?->user?->name ?? 'N/A',
                'last_vitals' => $lastVital ? $lastVital->recorded_at->diffForHumans() : 'Never recorded',
                'admission_date' => $admission->admission_date,
            ];
        });

        return response()->json($patients);
    }

    /**
     * Get recent vital signs recordings
     */
    public function getRecentVitals(Request $request)
    {
        $query = VitalSign::with(['admission.patient', 'admission.bed.ward'])
            ->orderBy('recorded_at', 'desc');

        if ($request->has('admission_id')) {
            $query->where('admission_id', $request->admission_id);
        }

        $vitals = $query->paginate(20);

        $vitals->getCollection()->transform(function ($vital) {
            return [
                'id' => $vital->id,
                'admission_id' => $vital->admission_id,
                'patient_name' => $vital->admission?->patient?->name ?? 'Unknown',
                'ward' => $vital->admission?->bed?->ward?->name ?? 'N/A',
                'bed_number' => $vital->admission?->bed?->bed_number ?? 'N/A',
                'blood_pressure' => ($vital->bp_systolic && $vital->bp_diastolic)
                    ? "{$vital->bp_systolic}/{$vital->bp_diastolic}" : null,
                'heart_rate' => $vital->pulse,
                'temperature' => $vital->temperature,
                'respiratory_rate' => $vital->respiratory_rate,
                'oxygen_saturation' => $vital->spo2,
                'recorded_at' => $vital->recorded_at,
                'recorded_by' => $vital->recorded_by,
                'time_ago' => $vital->recorded_at ? $vital->recorded_at->diffForHumans() : null,
            ];
        });

        return response()->json($vitals);
    }

    /**
     * Get tasks for the nurse (derived from pending vitals and nursing notes)
     */
    public function getTasks(Request $request)
    {
        $user = $request->user();

        // Build tasks from admissions that need vitals
        $admissions = Admission::with(['patient', 'bed.ward'])
            ->where('status', 'admitted')
            ->get();

        $fourHoursAgo = now()->subHours(4);
        $tasks = [];

        foreach ($admissions as $admission) {
            $lastVital = VitalSign::where('admission_id', $admission->id)
                ->orderBy('recorded_at', 'desc')
                ->first();

            if (!$lastVital || $lastVital->recorded_at < $fourHoursAgo) {
                $tasks[] = [
                    'id' => 'vital-' . $admission->id,
                    'title' => 'Record vital signs',
                    'patient_name' => $admission->patient?->name ?? 'Unknown',
                    'ward' => $admission->bed?->bed_number ?? 'N/A',
                    'priority' => (!$lastVital || $lastVital->recorded_at < now()->subHours(6)) ? 'high' : 'medium',
                    'due_time' => now()->format('H:i'),
                    'completed' => false,
                    'type' => 'vitals',
                    'admission_id' => $admission->id,
                    'notes' => $lastVital ? 'Last recorded: ' . $lastVital->recorded_at->diffForHumans() : 'Never recorded',
                ];
            }
        }

        // Sort by priority (high first)
        usort($tasks, function ($a, $b) {
            $priorityOrder = ['high' => 0, 'medium' => 1, 'low' => 2];
            return ($priorityOrder[$a['priority']] ?? 2) <=> ($priorityOrder[$b['priority']] ?? 2);
        });

        return response()->json($tasks);
    }

    /**
     * Mark a task as completed
     */
    public function completeTask(Request $request, $id)
    {
        // Tasks are dynamically generated, so "completing" a vitals task
        // means vitals have been recorded. Return success.
        return response()->json(['message' => 'Task marked as completed']);
    }

    /**
     * Get nurse profile
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->with('shift')->first();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
            'employee' => $employee ? [
                'id' => $employee->id,
                'employee_code' => $employee->employee_code,
                'designation' => $employee->designation,
                'department' => $employee->department?->name ?? 'N/A',
                'shift' => $employee->shift ? [
                    'name' => $employee->shift->name,
                    'start_time' => $employee->shift->start_time,
                    'end_time' => $employee->shift->end_time,
                ] : null,
                'join_date' => $employee->join_date,
            ] : null,
        ]);
    }

    /**
     * Update nurse profile (limited fields only)
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'current_password' => 'required_with:new_password|string',
            'new_password' => 'sometimes|string|min:8|confirmed',
        ]);

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }
        if (isset($validated['phone'])) {
            $user->phone = $validated['phone'];
        }

        // Password change
        if (isset($validated['current_password']) && isset($validated['new_password'])) {
            if (!Hash::check($validated['current_password'], $user->password)) {
                return response()->json(['message' => 'Current password is incorrect'], 422);
            }
            $user->password = Hash::make($validated['new_password']);
        }

        $user->save();

        return response()->json(['message' => 'Profile updated successfully', 'user' => $user]);
    }
}
