<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DoctorAppointmentRequest;
use App\Http\Requests\DoctorPrescriptionRequest;
use App\Models\Appointment;
use App\Models\Prescription;
use App\Models\PatientNote;
use App\Models\DoctorSchedule;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DoctorPortalController extends Controller
{
    /**
     * Get all appointments for the authenticated doctor
     */
    public function getAppointments(Request $request)
    {
        $doctor = Auth::user();

        $query = Appointment::where('doctor_id', $doctor->id)
            ->with(['patient']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $query->whereDate('appointment_date', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->whereDate('appointment_date', '<=', $request->date_to);
        }

        return response()->json($query->orderBy('appointment_date', 'desc')->paginate(15));
    }

    /**
     * Create a new appointment
     */
    public function createAppointment(DoctorAppointmentRequest $request)
    {
        $doctor = Auth::user();

        $appointment = Appointment::create([
            'doctor_id' => $doctor->id,
            'patient_id' => $request->patient_id,
            'appointment_date' => $request->appointment_date,
            'appointment_time' => $request->appointment_time,
            'duration' => $request->duration ?? 30,
            'reason' => $request->reason,
            'notes' => $request->notes,
            'status' => $request->status ?? 'scheduled',
        ]);

        return response()->json($appointment->load('patient'), 201);
    }

    /**
     * Update an appointment
     */
    public function updateAppointment(DoctorAppointmentRequest $request, $id)
    {
        $doctor = Auth::user();
        $appointment = Appointment::where('doctor_id', $doctor->id)->findOrFail($id);

        $appointment->update($request->validated());

        return response()->json($appointment->load('patient'));
    }

    /**
     * Cancel an appointment
     */
    public function cancelAppointment($id)
    {
        $doctor = Auth::user();
        $appointment = Appointment::where('doctor_id', $doctor->id)->findOrFail($id);

        $appointment->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Appointment cancelled successfully']);
    }

    /**
     * Get all prescriptions created by the authenticated doctor
     */
    public function getPrescriptions(Request $request)
    {
        $doctor = Auth::user();

        $query = Prescription::where('doctor_id', $doctor->id)
            ->with(['patient']);

        // Filter by patient
        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        return response()->json($query->orderBy('created_at', 'desc')->paginate(15));
    }

    /**
     * Create a new prescription
     */
    public function createPrescription(DoctorPrescriptionRequest $request)
    {
        $doctor = Auth::user();

        $prescription = Prescription::create([
            'doctor_id' => $doctor->id,
            'patient_id' => $request->patient_id,
            'diagnosis' => $request->diagnosis,
            'medications' => json_encode($request->medications),
            'notes' => $request->notes,
            'follow_up_date' => $request->follow_up_date,
        ]);

        return response()->json($prescription->load('patient'), 201);
    }

    /**
     * Update a prescription
     */
    public function updatePrescription(DoctorPrescriptionRequest $request, $id)
    {
        $doctor = Auth::user();
        $prescription = Prescription::where('doctor_id', $doctor->id)->findOrFail($id);

        $prescription->update([
            'diagnosis' => $request->diagnosis,
            'medications' => json_encode($request->medications),
            'notes' => $request->notes,
            'follow_up_date' => $request->follow_up_date,
        ]);

        return response()->json($prescription->load('patient'));
    }

    /**
     * Delete a prescription (soft delete)
     */
    public function deletePrescription($id)
    {
        $doctor = Auth::user();
        $prescription = Prescription::where('doctor_id', $doctor->id)->findOrFail($id);

        $prescription->delete();

        return response()->json(['message' => 'Prescription deleted successfully']);
    }

    /**
     * Get patients assigned to the authenticated doctor
     */
    public function getPatients(Request $request)
    {
        $doctor = Auth::user();

        // Get patients who have appointments with this doctor
        $query = User::where('role', 'patient')
            ->whereHas('appointments', function ($q) use ($doctor) {
                $q->where('doctor_id', $doctor->id);
            })
            ->with(['patient']);

        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->paginate(15));
    }

    /**
     * Get patient notes
     */
    public function getPatientNotes($patientId)
    {
        $doctor = Auth::user();

        $notes = PatientNote::where('doctor_id', $doctor->id)
            ->where('patient_id', $patientId)
            ->orderBy('visit_date', 'desc')
            ->get();

        return response()->json($notes);
    }

    /**
     * Create a patient note
     */
    public function createPatientNote(Request $request, $patientId)
    {
        $doctor = Auth::user();

        $validated = $request->validate([
            'visit_date' => 'required|date',
            'chief_complaint' => 'nullable|string',
            'symptoms' => 'nullable|string',
            'diagnosis' => 'nullable|string',
            'treatment_plan' => 'nullable|string',
            'notes' => 'nullable|string',
            'follow_up_instructions' => 'nullable|string',
            'next_visit_date' => 'nullable|date',
        ]);

        $note = PatientNote::create([
            'doctor_id' => $doctor->id,
            'patient_id' => $patientId,
            ...$validated,
        ]);

        return response()->json($note, 201);
    }

    /**
     * Update a patient note
     */
    public function updatePatientNote(Request $request, $patientId, $noteId)
    {
        $doctor = Auth::user();

        $note = PatientNote::where('doctor_id', $doctor->id)
            ->where('patient_id', $patientId)
            ->findOrFail($noteId);

        $validated = $request->validate([
            'visit_date' => 'date',
            'chief_complaint' => 'nullable|string',
            'symptoms' => 'nullable|string',
            'diagnosis' => 'nullable|string',
            'treatment_plan' => 'nullable|string',
            'notes' => 'nullable|string',
            'follow_up_instructions' => 'nullable|string',
            'next_visit_date' => 'nullable|date',
        ]);

        $note->update($validated);

        return response()->json($note);
    }

    /**
     * Get doctor's schedule
     */
    public function getSchedule()
    {
        $doctor = Auth::user();

        $schedule = DoctorSchedule::where('doctor_id', $doctor->id)
            ->orderByRaw("FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')")
            ->get();

        return response()->json($schedule);
    }

    /**
     * Create or update schedule
     */
    public function updateSchedule(Request $request)
    {
        $doctor = Auth::user();

        $validated = $request->validate([
            'schedules' => 'required|array',
            'schedules.*.day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'schedules.*.start_time' => 'required|date_format:H:i',
            'schedules.*.end_time' => 'required|date_format:H:i|after:schedules.*.start_time',
            'schedules.*.is_available' => 'boolean',
            'schedules.*.slot_duration' => 'integer|min:15|max:120',
            'schedules.*.notes' => 'nullable|string',
        ]);

        // Delete existing schedules
        DoctorSchedule::where('doctor_id', $doctor->id)->delete();

        // Create new schedules
        $schedules = [];
        foreach ($validated['schedules'] as $scheduleData) {
            $schedules[] = DoctorSchedule::create([
                'doctor_id' => $doctor->id,
                ...$scheduleData,
            ]);
        }

        return response()->json($schedules, 201);
    }

    /**
     * Block a time slot
     */
    public function blockTimeSlot(Request $request)
    {
        $doctor = Auth::user();

        $validated = $request->validate([
            'day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'notes' => 'nullable|string',
        ]);

        $schedule = DoctorSchedule::create([
            'doctor_id' => $doctor->id,
            'is_available' => false,
            ...$validated,
        ]);

        return response()->json($schedule, 201);
    }

    /**
     * Delete a schedule slot
     */
    public function deleteScheduleSlot($id)
    {
        $doctor = Auth::user();
        $schedule = DoctorSchedule::where('doctor_id', $doctor->id)->findOrFail($id);

        $schedule->delete();

        return response()->json(['message' => 'Schedule slot deleted successfully']);
    }
}
