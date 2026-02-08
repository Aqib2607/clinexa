<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Ward;
use App\Models\Bed;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Department;
use App\Models\Admission;
use App\Http\Controllers\Api\IpdController;
use App\Http\Controllers\Api\NursingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

echo "Starting IPD Verification...\n";

DB::beginTransaction();

try {
    // 1. Setup Data
    $user = User::first() ?? User::create(['name' => 'Admin', 'email' => 'admin@ipd.com', 'password' => 'password']);
    Auth::login($user);

    $dept = Department::first() ?? Department::create(['name' => 'General Medicine', 'code' => 'GM', 'description' => 'General']);

    $doctor = Doctor::first() ?? Doctor::create(['user_id' => $user->id, 'specialization' => 'General', 'department_id' => $dept->id, 'qualification' => 'MBBS']);

    // Fix Patient creation: use 'name', 'uhid'
    $patient = Patient::create([
        'name' => 'John Doe',
        'uhid' => 'UHID-' . mt_rand(10000, 99999),
        'dob' => '1990-01-01',
        'gender' => 'Male',
        'phone' => '1234567890',
        'address' => 'Test Address'
    ]);

    $ward = Ward::create(['name' => 'General Ward ' . mt_rand(100, 999), 'type' => 'General']);
    $bed1 = Bed::create(['ward_id' => $ward->id, 'number' => '101-' . mt_rand(100, 999), 'daily_charge' => 1000, 'status' => 'available']);
    $bed2 = Bed::create(['ward_id' => $ward->id, 'number' => '102-' . mt_rand(100, 999), 'daily_charge' => 1000, 'status' => 'available']);

    echo "[PASS] Setup Data Created.\n";

    // 2. Admit Patient
    $ipdController = new IpdController();
    $request = Request::create('/api/ipd/admissions', 'POST', [
        'patient_id' => $patient->id,
        'doctor_id' => $doctor->id,
        'bed_id' => $bed1->id,
        'initial_deposit' => 500,
    ]);
    $response = $ipdController->admit($request);
    $admission = $response->getData();
    // Decode JSON if needed, or if it returns JsonResponse, use getData() which returns object
    // Laravel JsonResponse getData() returns object by default.

    if (isset($admission->id) && $admission->status === 'admitted') {
        echo "[PASS] Patient Admitted to Bed {$bed1->number}.\n";
    } else {
        throw new Exception("Admission failed: " . json_encode($admission));
    }

    $admissionId = $admission->id;

    // 3. Nursing: Add Vitals
    $nursingController = new NursingController();
    $reqVitals = Request::create("/api/nursing/admissions/{$admissionId}/vitals", 'POST', [
        'temperature' => 98.6,
        'pulse' => 72
    ]);
    $nursingController->storeVitals($reqVitals, $admissionId);
    echo "[PASS] Vitals Recorded.\n";

    // 4. Transfer Bed
    $reqTransfer = Request::create("/api/ipd/beds/transfer/{$admissionId}", 'POST', [
        'to_bed_id' => $bed2->id,
        'reason' => 'Patient request'
    ]);
    $ipdController->transferBed($reqTransfer, $admissionId);

    $bed1->refresh();
    $bed2->refresh();
    if ($bed1->status === 'available' && $bed2->status === 'occupied') {
        echo "[PASS] Transferred to Bed {$bed2->number}.\n";
    } else {
        throw new Exception("Transfer failed.");
    }

    // 5. Billing & Discharge
    // Add extra charge
    $reqCharge = Request::create("/api/ipd/admissions/{$admissionId}/charge", 'POST', [
        'charge_name' => 'Nursing Charge',
        'amount' => 200
    ]);
    $ipdController->addCharge($reqCharge, $admissionId);

    // Try Discharge (Should fail - Paid 500 vs Due (1000 bed + 200 charge) = 1200)
    $reqDischarge = Request::create("/api/ipd/admissions/{$admissionId}/discharge", 'POST', ['type' => 'regular']);
    $respDischarge = $ipdController->discharge($reqDischarge, $admissionId);

    if ($respDischarge->getStatusCode() === 400) {
        echo "[PASS] Discharge Blocked due to Dues.\n";
    } else {
        throw new Exception("Discharge should have been blocked. Status: " . $respDischarge->getStatusCode());
    }

    // Pay remaining
    // Due = 1200 - 500 = 700
    $reqPay = Request::create("/api/ipd/admissions/{$admissionId}/payment", 'POST', [
        'amount' => 700,
        'payment_method' => 'cash'
    ]);
    $ipdController->addPayment($reqPay, $admissionId);
    echo "[PASS] Payment Made.\n";

    // Discharge Again
    $respDischarge2 = $ipdController->discharge($reqDischarge, $admissionId);
    if ($respDischarge2->getStatusCode() === 200) {
        echo "[PASS] Discharged Successfully.\n";
    } else {
        echo "Discharge Error: " . json_encode($respDischarge2->getData()) . "\n";
        throw new Exception("Discharge failed after payment.");
    }
} catch (Exception $e) {
    echo "[FAIL] " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
} finally {
    DB::rollBack();
    echo "\nRolled back changes.\n";
}
