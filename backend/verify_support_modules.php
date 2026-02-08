<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Store;
use App\Models\Item;
use App\Models\ItemBatch;
use App\Models\Requisition;
use App\Models\Employee;
use App\Models\ChartOfAccount;
use App\Models\Voucher;
use App\Models\CafeteriaItem;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\HrController;
use App\Http\Controllers\Api\AccountsController;
use App\Http\Controllers\Api\CafeteriaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

echo "Starting Support Modules Verification...\n";

DB::beginTransaction();

try {
    // 0. Setup User
    $user = User::first() ?? User::create(['name' => 'Admin', 'email' => 'admin@support.com', 'password' => 'password']);
    Auth::login($user);

    // --- 1. Inventory ---
    echo "\n[Inventory Testing]\n";
    $store1 = Store::create(['name' => 'Main Store', 'code' => 'STR-M', 'is_main_store' => true]);
    $store2 = Store::create(['name' => 'Pharmacy Store', 'code' => 'STR-P']);

    $invController = new InventoryController();

    // Create Item
    $reqItem = Request::create('/api/inventory/items', 'POST', [
        'name' => 'Paracetamol 500mg',
        'code' => 'MED-001-' . mt_rand(100, 999),
        'type' => 'medicine',
        'unit' => 'box'
    ]);
    $item = $invController->createItem($reqItem)->getData();
    echo "[PASS] Item Created: {$item->name}\n";

    // Receive Stock
    $reqReceive = Request::create('/api/inventory/stock/receive', 'POST', [
        'store_id' => $store1->id,
        'item_id' => $item->id,
        'batch_no' => 'B-' . mt_rand(1000, 9999),
        'quantity' => 100,
        'purchase_price' => 50,
        'sale_price' => 100,
        'expiry_date' => '2027-01-01'
    ]);
    $batch = $invController->receiveStock($reqReceive)->getData();
    echo "[PASS] Stock Received: {$batch->quantity} units in Main Store.\n";

    // Requisition
    $reqReq = Request::create('/api/inventory/requisitions', 'POST', [
        'from_store_id' => $store2->id,
        'to_store_id' => $store1->id,
        'items' => [['item_id' => $item->id, 'quantity' => 20]]
    ]);
    $requisition = $invController->createRequisition($reqReq)->getData();
    echo "[PASS] Requisition Created: {$requisition->requisition_no}\n";

    // Fulfill
    $reqFulfill = Request::create("/api/inventory/requisitions/{$requisition->id}/fulfill", 'POST');
    $invController->fulfillRequisition($reqFulfill, $requisition->id);

    // Verify Transfer
    $store2Batch = ItemBatch::where('store_id', $store2->id)->where('item_id', $item->id)->first();
    if ($store2Batch && $store2Batch->quantity == 20) {
        echo "[PASS] Requisition Fulfilled. Pharmacy Store has 20 units.\n";
    } else {
        throw new Exception("Requisition fulfillment failed.");
    }

    // --- 2. HR ---
    echo "\n[HR Testing]\n";
    $hrController = new HrController();

    // Create Employee
    $reqEmp = Request::create('/api/hr/employees', 'POST', [
        'name' => 'John Staff',
        'email' => 'john' . mt_rand(100, 999) . '@staff.com',
        'employee_code' => 'EMP-' . mt_rand(1000, 9999),
        'designation' => 'Nurse',
        'join_date' => '2024-01-01',
        'basic_salary' => 50000
    ]);
    $employee = $hrController->createEmployee($reqEmp)->getData();
    echo "[PASS] Employee Created: {$employee->employee_code}\n";

    // Mark Attendance
    $reqAtt = Request::create('/api/hr/attendance', 'POST', [
        'employee_id' => $employee->id,
        'date' => date('Y-m-d'),
        'status' => 'present',
        'check_in' => '09:00'
    ]);
    $hrController->markAttendance($reqAtt);
    echo "[PASS] Attendance Marked.\n";

    // Generate Payroll
    $reqPay = Request::create('/api/hr/payroll/generate', 'POST', [
        'month' => date('n'),
        'year' => date('Y')
    ]);
    $payrollResp = $hrController->generatePayroll($reqPay)->getData();
    echo "[PASS] {$payrollResp->message}. Count: {$payrollResp->count}\n";

    // --- 3. Accounts ---
    echo "\n[Accounts Testing]\n";
    $accController = new AccountsController();

    // Create COA
    $cashAcc = ChartOfAccount::create(['code' => '1001', 'name' => 'Cash', 'type' => 'asset']);
    $capitalAcc = ChartOfAccount::create(['code' => '3001', 'name' => 'Capital', 'type' => 'equity']);

    // Create Voucher
    $reqVoucher = Request::create('/api/accounts/vouchers', 'POST', [
        'date' => date('Y-m-d'),
        'type' => 'receipt',
        'entries' => [
            ['coa_id' => $cashAcc->id, 'debit' => 10000, 'credit' => 0],
            ['coa_id' => $capitalAcc->id, 'debit' => 0, 'credit' => 10000]
        ]
    ]);
    $voucher = $accController->createVoucher($reqVoucher)->getData();
    echo "[PASS] Voucher Created: {$voucher->voucher_no}\n";

    // Trial Balance
    $tb = $accController->getTrialBalance()->getData();
    $cashEntry = collect($tb)->firstWhere('code', '1001');
    if ($cashEntry->debit == 10000) {
        echo "[PASS] Trial Balance Verified.\n";
    } else {
        throw new Exception("Trial Balance Mismatch.");
    }

    // --- 4. Cafeteria ---
    echo "\n[Cafeteria Testing]\n";
    $cafController = new CafeteriaController();

    $burger = CafeteriaItem::create(['name' => 'Burger', 'code' => 'FOOD-01', 'price' => 150]);

    $reqSale = Request::create('/api/cafeteria/sales', 'POST', [
        'payment_method' => 'cash',
        'items' => [['item_id' => $burger->id, 'quantity' => 2]]
    ]);
    $sale = $cafController->storeSale($reqSale)->getData();

    if ($sale->total_amount == 300) {
        echo "[PASS] Cafeteria Sale Completed. Total: {$sale->total_amount}\n";
    } else {
        throw new Exception("Cafeteria Sale total mismatch.");
    }
} catch (Exception $e) {
    echo "[FAIL] " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
} finally {
    DB::rollBack();
    echo "\nRolled back changes.\n";
}
