<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Phase 1: Core Clinical Routes
Route::apiResource('departments', \App\Http\Controllers\Api\DepartmentController::class);
Route::apiResource('doctors', \App\Http\Controllers\Api\DoctorController::class);
Route::apiResource('patients', \App\Http\Controllers\Api\PatientController::class);
Route::apiResource('appointments', \App\Http\Controllers\Api\AppointmentController::class);
Route::apiResource('slots', \App\Http\Controllers\Api\AppointmentSlotController::class);
Route::post('slots/generate', [\App\Http\Controllers\Api\AppointmentSlotController::class, 'generate']);
Route::apiResource('prescriptions', \App\Http\Controllers\Api\PrescriptionController::class);

// Phase 2: Billing & Pharmacy Routes
Route::apiResource('visits', \App\Http\Controllers\Api\VisitController::class);
Route::get('services', [\App\Http\Controllers\Api\ServiceController::class, 'index']);

Route::apiResource('bills', \App\Http\Controllers\Api\BillingController::class);
Route::post('bills/{id}/items', [\App\Http\Controllers\Api\BillingController::class, 'addItem']);
Route::post('bills/{id}/payments', [\App\Http\Controllers\Api\BillingController::class, 'addPayment']);
Route::post('bills/{id}/finalize', [\App\Http\Controllers\Api\BillingController::class, 'finalize']);

Route::prefix('pharmacy')->group(function () {
    Route::get('items', [\App\Http\Controllers\Api\PharmacyController::class, 'indexItems']);
    Route::post('items', [\App\Http\Controllers\Api\PharmacyController::class, 'storeItem']);
    Route::post('stock', [\App\Http\Controllers\Api\PharmacyController::class, 'addStock']);
    Route::post('sales', [\App\Http\Controllers\Api\PharmacyController::class, 'storeSale']);
});

// Phase 3: Diagnostic Systems Routes (LIS & RIS)
Route::prefix('lis')->group(function () {
    Route::get('samples', [\App\Http\Controllers\Api\LisController::class, 'indexSamples']);
    Route::post('samples/{id}/collect', [\App\Http\Controllers\Api\LisController::class, 'collectSample']);
    Route::post('samples/{id}/receive', [\App\Http\Controllers\Api\LisController::class, 'receiveSample']);

    Route::get('results', [\App\Http\Controllers\Api\LisController::class, 'indexResults']);
    Route::post('results/{id}', [\App\Http\Controllers\Api\LisController::class, 'storeResult']);
    Route::post('results/{id}/verify', [\App\Http\Controllers\Api\LisController::class, 'verifyResult']);
    Route::post('results/{id}/finalize', [\App\Http\Controllers\Api\LisController::class, 'finalizeResult']);
    Route::get('reports/{id}', [\App\Http\Controllers\Api\LisController::class, 'getReport']);
});

Route::prefix('ris')->group(function () {
    Route::get('studies', [\App\Http\Controllers\Api\RisController::class, 'indexStudies']);
    Route::post('studies/{id}/result', [\App\Http\Controllers\Api\RisController::class, 'storeResult']);
    Route::post('results/{id}/finalize', [\App\Http\Controllers\Api\RisController::class, 'finalizeResult']);
    Route::get('reports/{id}', [\App\Http\Controllers\Api\RisController::class, 'getReport']);
});

// Phase 4: IPD & Nursing Routes
Route::prefix('ipd')->group(function () {
    // Bed Management
    Route::get('beds', [\App\Http\Controllers\Api\IpdController::class, 'indexBeds']);
    Route::post('beds/transfer/{id}', [\App\Http\Controllers\Api\IpdController::class, 'transferBed']); // Admission ID

    // Admission
    Route::post('admissions', [\App\Http\Controllers\Api\IpdController::class, 'admit']);
    Route::get('admissions/{id}', [\App\Http\Controllers\Api\IpdController::class, 'show']);

    // Billing & Discharge
    Route::post('admissions/{id}/charge', [\App\Http\Controllers\Api\IpdController::class, 'addCharge']);
    Route::post('admissions/{id}/payment', [\App\Http\Controllers\Api\IpdController::class, 'addPayment']);
    Route::post('admissions/{id}/discharge', [\App\Http\Controllers\Api\IpdController::class, 'discharge']);
});

Route::prefix('nursing')->group(function () {
    Route::get('worklist', [\App\Http\Controllers\Api\NursingController::class, 'indexWorklist']);
    Route::post('admissions/{id}/vitals', [\App\Http\Controllers\Api\NursingController::class, 'storeVitals']);
    Route::post('admissions/{id}/notes', [\App\Http\Controllers\Api\NursingController::class, 'storeNote']);
});

Route::prefix('ot')->group(function () {
    Route::get('bookings', [\App\Http\Controllers\Api\OtController::class, 'indexBookings']);
    Route::post('bookings', [\App\Http\Controllers\Api\OtController::class, 'storeBooking']);
    Route::patch('bookings/{id}/status', [\App\Http\Controllers\Api\OtController::class, 'updateStatus']);
});

// Phase 5: Support Modules
Route::prefix('inventory')->group(function () {
    Route::get('stores', [\App\Http\Controllers\Api\InventoryController::class, 'getStores']);
    Route::get('stock', [\App\Http\Controllers\Api\InventoryController::class, 'getStock']);
    Route::post('items', [\App\Http\Controllers\Api\InventoryController::class, 'createItem']);
    Route::post('categories', [\App\Http\Controllers\Api\InventoryController::class, 'createCategory']);
    Route::post('suppliers', [\App\Http\Controllers\Api\InventoryController::class, 'createSupplier']);
    Route::post('stock/receive', [\App\Http\Controllers\Api\InventoryController::class, 'receiveStock']);
    Route::post('requisitions', [\App\Http\Controllers\Api\InventoryController::class, 'createRequisition']);
    Route::post('requisitions/{id}/fulfill', [\App\Http\Controllers\Api\InventoryController::class, 'fulfillRequisition']);
    Route::post('issue/ipd', [\App\Http\Controllers\Api\InventoryController::class, 'issueToAdmission']);
});

Route::prefix('hr')->group(function () {
    Route::get('employees', [\App\Http\Controllers\Api\HrController::class, 'getEmployees']);
    Route::post('employees', [\App\Http\Controllers\Api\HrController::class, 'createEmployee']);
    Route::post('shifts', [\App\Http\Controllers\Api\HrController::class, 'createShift']);
    Route::post('leaves', [\App\Http\Controllers\Api\HrController::class, 'applyLeave']);
    Route::post('attendance', [\App\Http\Controllers\Api\HrController::class, 'markAttendance']);
    Route::post('payroll/generate', [\App\Http\Controllers\Api\HrController::class, 'generatePayroll']);
});

Route::prefix('accounts')->group(function () {
    Route::get('trial-balance', [\App\Http\Controllers\Api\AccountsController::class, 'getTrialBalance']);
    Route::post('cost-centers', [\App\Http\Controllers\Api\AccountsController::class, 'createCostCenter']);
    Route::post('vouchers', [\App\Http\Controllers\Api\AccountsController::class, 'createVoucher']);
});

Route::prefix('cafeteria')->group(function () {
    Route::get('items', [\App\Http\Controllers\Api\CafeteriaController::class, 'getItems']);
    Route::post('sales', [\App\Http\Controllers\Api\CafeteriaController::class, 'storeSale']);
});

// --- Phase 6: Automation & Patient Portal ---
Route::prefix('lab-automation')->group(function () {
    Route::post('receive', [\App\Http\Controllers\Api\LabAutomationController::class, 'receiveData']);
    Route::get('logs', [\App\Http\Controllers\Api\LabAutomationController::class, 'getLogs']);
});

Route::prefix('sms')->group(function () {
    Route::post('send', [\App\Http\Controllers\Api\SmsController::class, 'sendSms']);
    Route::get('logs', [\App\Http\Controllers\Api\SmsController::class, 'getLogs']);
});

Route::prefix('patient')->group(function () {
    Route::post('otp/request', [\App\Http\Controllers\Api\PatientPortalController::class, 'requestOtp']);
    Route::post('otp/verify', [\App\Http\Controllers\Api\PatientPortalController::class, 'verifyOtp']);
    Route::get('dashboard-data', [\App\Http\Controllers\Api\PatientPortalController::class, 'getDashboardData']);
    Route::get('download/{token}', [\App\Http\Controllers\Api\PatientPortalController::class, 'downloadSecure']);
});
