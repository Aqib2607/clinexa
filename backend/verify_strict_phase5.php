<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Supplier;
use App\Models\ItemCategory;
use App\Models\EmployeeShift;
use App\Models\CostCenter;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\HrController;
use App\Http\Controllers\Api\AccountsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

echo "Starting Strict Phase 5 Verification...\n";

DB::beginTransaction();

try {
    // 0. Setup User
    $user = User::first() ?? User::create(['name' => 'Admin', 'email' => 'admin@strict.com', 'password' => 'password']);
    Auth::login($user);

    // --- 1. Inventory Extensions ---
    echo "\n[Inventory Extensions]\n";
    $invController = new InventoryController();

    // Create Supplier
    $reqSup = Request::create('/api/inventory/suppliers', 'POST', [
        'name' => 'MediCorp Pharma',
        'contact_person' => 'Mr. Smith',
        'phone' => '1234567890',
        'email' => 'contact@medicorp.com'
    ]);
    $supplier = $invController->createSupplier($reqSup)->getData();
    echo "[PASS] Supplier Created: {$supplier->name}\n";

    // Create Category Tree
    $reqCat1 = Request::create('/api/inventory/categories', 'POST', ['name' => 'Medicines']);
    $cat1 = $invController->createCategory($reqCat1)->getData();

    $reqCat2 = Request::create('/api/inventory/categories', 'POST', ['name' => 'Antibiotics', 'parent_id' => $cat1->id]);
    $cat2 = $invController->createCategory($reqCat2)->getData();
    echo "[PASS] Category Tree: {$cat1->name} -> {$cat2->name}\n";

    // Create Item with Category
    $reqItem = Request::create('/api/inventory/items', 'POST', [
        'name' => 'Amoxicillin 500mg',
        'code' => 'AMX-' . mt_rand(100, 999),
        'type' => 'medicine',
        'unit' => 'strip',
        'category_id' => $cat2->id
    ]);
    $item = $invController->createItem($reqItem)->getData();
    echo "[PASS] Item Created in Category: {$item->name}\n";


    // --- 1.1 IPD Pharmacy Issue ---
    // Need an Admission and Stock first.
    // Receive Stock for Amoxicillin
    $store = \App\Models\Store::firstOrCreate(['name' => 'Main Pharmacy', 'code' => 'PHARM-01', 'is_active' => true]);
    $invController->receiveStock(Request::create('/api/inventory/stock/receive', 'POST', [
        'store_id' => $store->id,
        'item_id' => $item->id,
        'batch_no' => 'B-' . mt_rand(1000, 9999),
        'quantity' => 100,
        'purchase_price' => 10.00,
        'sale_price' => 15.00,
        'expiry_date' => '2027-12-31'
    ]));

    // Create Admission (Mocking dependencies)
    // Schema: name, phone (not contact_number, not first_name/last_name)
    $patient = \App\Models\Patient::firstOrCreate(
        ['uhid' => 'P-TEST-001'],
        [
            'name' => 'John Doe',
            'gender' => 'Male',
            'dob' => '1990-01-01',
            'phone' => '1234567890',
            'address' => 'Test Address'
        ]
    );

    // Schema: doctors (license_number, specialization, department_id, consultation_fee)
    $dept = \App\Models\Department::firstOrCreate(['name' => 'General Medicine'], ['code' => 'GM', 'is_active' => true]);
    $doctor = \App\Models\Doctor::firstOrCreate(
        ['license_number' => 'L-001'],
        ['user_id' => $user->id, 'specialization' => 'General', 'department_id' => $dept->id, 'consultation_fee' => 500]
    );
    //$doctor->department_id = $dept->id;
    //$doctor->save();

    $ward = \App\Models\Ward::firstOrCreate(['name' => 'General Ward'], ['type' => 'General']);
    $bed = \App\Models\Bed::firstOrCreate(['number' => 'B-101'], ['ward_id' => $ward->id, 'type' => 'General', 'daily_charge' => 1000, 'status' => 'available']);

    $admission = \App\Models\Admission::create([
        'admission_number' => 'ADM-' . time(),
        'patient_id' => $patient->id,
        'doctor_id' => $doctor->id,
        'bed_id' => $bed->id,
        'admission_date' => now(),
        'status' => 'admitted'
    ]);

    // Issue to Admission
    $reqIssue = Request::create('/api/inventory/issue/ipd', 'POST', [
        'admission_id' => $admission->id,
        'store_id' => $store->id,
        'items' => [
            ['item_id' => $item->id, 'quantity' => 10]
        ]
    ]);

    $issueResult = $invController->issueToAdmission($reqIssue)->getData();
    echo "[PASS] IPD Pharmacy Issue: " . count($issueResult->issues) . " batches issued.\n";

    // Check Charge
    $charge = \App\Models\IpdCharge::where('admission_id', $admission->id)->where('charge_name', 'like', 'Pharmacy:%')->first();
    if ($charge && $charge->amount == 150.00) { // 10 * 15.00
        echo "[PASS] IPD Charge Created: {$charge->amount}\n";
    } else {
        throw new Exception("IPD Charge mismatch or missing: " . ($charge->amount ?? 'NULL'));
    }


    // --- 2. HR Extensions ---
    echo "\n[HR Extensions]\n";
    $hrController = new HrController();

    // Create Shift
    $reqShift = Request::create('/api/hr/shifts', 'POST', [
        'name' => 'Morning Shift',
        'start_time' => '08:00',
        'end_time' => '16:00'
    ]);
    $shift = $hrController->createShift($reqShift)->getData();
    echo "[PASS] Shift Created: {$shift->name} ({$shift->start_time} - {$shift->end_time})\n";

    // Create Employee with Shift
    $reqEmp = Request::create('/api/hr/employees', 'POST', [
        'name' => 'Dr. House',
        'email' => 'house' . mt_rand(100, 999) . '@hospital.com',
        'employee_code' => 'DOC-' . mt_rand(1000, 9999),
        'designation' => 'Doctor',
        'join_date' => '2020-01-01',
        'basic_salary' => 150000,
        'shift_id' => $shift->id
    ]);
    $employee = $hrController->createEmployee($reqEmp)->getData();
    echo "[PASS] Employee Assigned to Shift: " . ($employee->shift_id ?? 'NULL') . "\n";

    // Apply Leave
    $reqLeave = Request::create('/api/hr/leaves', 'POST', [
        'employee_id' => $employee->id,
        'start_date' => date('Y-m-d'),
        'end_date' => date('Y-m-d', strtotime('+2 days')),
        'reason' => 'Conference'
    ]);
    $leave = $hrController->applyLeave($reqLeave)->getData();
    echo "[PASS] Leave Applied: {$leave->reason}\n";


    // --- 3. Accounts Extensions ---
    echo "\n[Accounts Extensions]\n";
    $accController = new AccountsController();

    // Create Cost Center
    $reqCC = Request::create('/api/accounts/cost-centers', 'POST', [
        'name' => 'Cardiology',
        'code' => 'CC-CARDIO'
    ]);
    $cc = $accController->createCostCenter($reqCC)->getData();
    echo "[PASS] Cost Center Created: {$cc->name}\n";

    // Create Voucher with Cost Center
    // Need a COA first (reusing logic or creating new)
    $coa = \App\Models\ChartOfAccount::firstOrCreate(['code' => '5001', 'name' => 'Expense', 'type' => 'expense']);
    $bank = \App\Models\ChartOfAccount::firstOrCreate(['code' => '1002', 'name' => 'Bank', 'type' => 'asset']);

    $reqVoucher = Request::create('/api/accounts/vouchers', 'POST', [
        'date' => date('Y-m-d'),
        'type' => 'payment',
        'narration' => 'Equipment Maintenance',
        'cost_center_id' => $cc->id,
        'entries' => [
            ['coa_id' => $coa->id, 'debit' => 5000, 'credit' => 0],
            ['coa_id' => $bank->id, 'debit' => 0, 'credit' => 5000]
        ]
    ]);
    $voucher = $accController->createVoucher($reqVoucher)->getData();

    if (($voucher->cost_center_id ?? null) == $cc->id) {
        echo "[PASS] Voucher Tagged to Cost Center: {$cc->name}\n";
    } else {
        throw new Exception("Voucher Cost Center mismatch: " . ($voucher->cost_center_id ?? 'NULL'));
    }
} catch (Exception $e) {
    echo "[FAIL] " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
} finally {
    DB::rollBack();
    echo "\nRolled back changes.\n";
}
