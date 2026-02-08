<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Patient;
use App\Models\LabMachineConfig;
use App\Models\SmsTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

echo "Starting Phase 6 Verification (Automation, SMS, Patient Portal)...\n";

DB::beginTransaction();

try {
    // 0. Setup
    $user = User::first() ?? User::create(['name' => 'Admin', 'email' => 'admin@phase6.com', 'password' => 'password']);
    Auth::login($user);

    // --- 1. Lab Automation ---
    echo "\n[Lab Automation]\n";
    $machine = LabMachineConfig::create([
        'machine_name' => 'Test Analyzer',
        'ip_address' => '192.168.1.100',
        'protocol' => 'ASTM'
    ]);

    $controller = new \App\Http\Controllers\Api\LabAutomationController();
    $reqLab = Request::create('/api/lab-automation/receive', 'POST', [
        'machine_ip' => '192.168.1.100',
        'raw_data' => "H|\^&|||Test Analyzer|||||||P|1\nP|1||P123||Doe^John\nO|1|SAMP001||^^^WBC|R\nR|1|^^^WBC|10.5|uL|||F\nL|1|N"
    ]);

    $resLab = $controller->receiveData($reqLab);
    $dataLab = $resLab->getData();

    if (isset($dataLab->log_id)) {
        echo "[PASS] Data Received & Logged. Log ID: {$dataLab->log_id}\n";
        $log = \App\Models\LabMachineLog::find($dataLab->log_id);
        echo "       Status: {$log->status}\n";
    } else {
        throw new Exception("Lab Data Receive Failed: " . json_encode($dataLab));
    }


    // --- 2. SMS System ---
    echo "\n[SMS System]\n";
    SmsTemplate::create([
        'event_name' => 'otp_login',
        'template_body' => 'Your OTP is {otp}. Valid for 10 mins.',
        'variables' => ['otp']
    ]);

    $smsController = new \App\Http\Controllers\Api\SmsController();
    $reqSms = Request::create('/api/sms/send', 'POST', [
        'mobile_number' => '9876543210',
        'event_name' => 'otp_login',
        'variables' => ['otp' => '123456']
    ]);

    $resSms = $smsController->sendSms($reqSms);
    $dataSms = $resSms->getData();

    if (isset($dataSms->log) && $dataSms->log->status === 'sent') {
        echo "[PASS] SMS Sent: {$dataSms->log->message_body}\n";
    } else {
        throw new Exception("SMS Send Failed");
    }


    // --- 3. Patient Portal ---
    echo "\n[Patient Portal]\n";
    // Ensure Patient exists with phone
    $uniquePhone = '999' . mt_rand(1000000, 9999999);
    $patient = Patient::firstOrCreate(
        ['uhid' => 'P-PORTAL-TEST'],
        ['name' => 'Portal User', 'phone' => $uniquePhone, 'gender' => 'Male', 'dob' => '1990-01-01', 'address' => 'Web']
    );

    $portalController = new \App\Http\Controllers\Api\PatientPortalController();

    // 3.1 Request OTP
    $reqOtp = Request::create('/api/patient/otp/request', 'POST', ['mobile_number' => $uniquePhone]);
    $resOtp = $portalController->requestOtp($reqOtp);
    $dataOtp = $resOtp->getData();

    if (isset($dataOtp->dev_hint)) {
        echo "[PASS] OTP Requested. Dev Hint: {$dataOtp->dev_hint}\n";
        $otpCode = $dataOtp->dev_hint;
    } else {
        throw new Exception("OTP Request Failed");
    }

    // 3.2 Verify OTP
    $reqVerify = Request::create('/api/patient/otp/verify', 'POST', [
        'mobile_number' => $uniquePhone,
        'otp' => (string)$otpCode
    ]);
    $resVerify = $portalController->verifyOtp($reqVerify);
    $dataVerify = $resVerify->getData();

    if (isset($dataVerify->token)) {
        echo "[PASS] OTP Verified. Token Issued.\n";
    } else {
        throw new Exception("OTP Verification Failed");
    }

    // 3.3 Secure Download
    // Generate a link (simulate admin action)
    $reqLink = Request::create('/api/patient/generate-link', 'POST', [ // Internal helper for test
        'patient_id' => $patient->id,
        'resource_type' => 'lab_report',
        'resource_id' => 'RES-001'
    ]);
    // Allow the controller to handle this internal generation or manually create
    $linkToken = \Illuminate\Support\Str::random(32);
    \App\Models\SecureLink::create([
        'patient_id' => $patient->id,
        'resource_type' => 'lab_report',
        'resource_id' => 'RES-001',
        'token' => $linkToken,
        'expires_at' => now()->addDays(7)
    ]);

    $reqDownload = Request::create("/api/patient/download/{$linkToken}", 'GET');
    $resDownload = $portalController->downloadSecure($reqDownload, $linkToken);
    $dataDownload = $resDownload->getData();

    if (isset($dataDownload->content)) {
        echo "[PASS] Secure Download Accessed: {$dataDownload->content}\n";
    } else {
        throw new Exception("Secure Download Failed");
    }
} catch (Exception $e) {
    echo "[FAIL] " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
} finally {
    DB::rollBack();
    echo "\nRolled back changes.\n";
}
