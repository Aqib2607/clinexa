<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            [
                'name' => 'Cardiology',
                'code' => 'CARD',
                'description' => 'Heart and cardiovascular system',
                'overview' => 'Our Cardiology department provides comprehensive cardiac care with state-of-the-art facilities and experienced cardiologists. We specialize in diagnosis, treatment, and prevention of heart diseases.',
                'services' => json_encode(['Angiography', 'Angioplasty', 'Pacemaker Implantation', 'ECG', 'Echocardiography', 'Stress Testing', 'Cardiac Rehabilitation']),
                'facilities' => json_encode(['24/7 Emergency Cardiac Care', 'Advanced Cath Lab', 'Non-invasive Cardiology Lab', 'Cardiac ICU'])
            ],
            [
                'name' => 'Neurology',
                'code' => 'NEUR',
                'description' => 'Nervous system',
                'overview' => 'The Neurology department offers expert care for disorders of the brain, spinal cord, and nervous system. Our team uses advanced diagnostic tools and treatment methods.',
                'services' => json_encode(['Stroke Management', 'Epilepsy Treatment', 'Movement Disorder Care', 'Headache Clinic', 'EEG', 'EMG/NCV Studies', 'Neuroimaging']),
                'facilities' => json_encode(['Neuro ICU', 'Advanced MRI & CT', 'EEG Lab', 'Stroke Unit'])
            ],
            [
                'name' => 'Orthopedics',
                'code' => 'ORTH',
                'description' => 'Bones and muscles',
                'overview' => 'Our Orthopedics department provides comprehensive care for musculoskeletal conditions, from sports injuries to joint replacements.',
                'services' => json_encode(['Joint Replacement Surgery', 'Arthroscopy', 'Spine Surgery', 'Sports Medicine', 'Trauma Care', 'Fracture Management', 'Physiotherapy']),
                'facilities' => json_encode(['Modern Operation Theaters', 'Digital X-ray', 'Physiotherapy Center', 'Sports Medicine Clinic'])
            ],
            [
                'name' => 'Pediatrics',
                'code' => 'PED',
                'description' => 'Medical care of infants, children, and adolescents',
                'overview' => 'Our Pediatrics department provides specialized healthcare for children from birth through adolescence with compassionate and family-centered care.',
                'services' => json_encode(['Neonatal Care', 'Vaccination', 'Growth Monitoring', 'Pediatric Emergency', 'Child Development Assessment', 'Pediatric Surgery']),
                'facilities' => json_encode(['NICU', 'Pediatric ICU', 'Vaccination Center', 'Child-friendly Environment'])
            ],
            [
                'name' => 'Gynecology',
                'code' => 'GYN',
                'description' => 'Female reproductive system',
                'overview' => 'The Gynecology department offers comprehensive women\'s health services including obstetrics, gynecological care, and fertility treatments.',
                'services' => json_encode(['Prenatal Care', 'High-Risk Pregnancy Management', 'Normal & C-Section Delivery', 'Infertility Treatment', 'Laparoscopic Surgery', 'Menopause Management']),
                'facilities' => json_encode(['Modern Labor Rooms', 'NICU', 'Ultrasound', 'IVF Center'])
            ],
            [
                'name' => 'Dermatology',
                'code' => 'DERM',
                'description' => 'Skin, hair, and nails',
                'overview' => 'Our Dermatology department provides expert care for all skin, hair, and nail conditions with both medical and cosmetic treatments.',
                'services' => json_encode(['Acne Treatment', 'Hair Loss Treatment', 'Skin Allergy Management', 'Cosmetic Procedures', 'Laser Treatments', 'Chemical Peels']),
                'facilities' => json_encode(['Dermatology OPD', 'Laser Center', 'Cosmetic Clinic', 'Skin Biopsy Lab'])
            ],
            [
                'name' => 'General Medicine',
                'code' => 'GENM',
                'description' => 'Adult diseases',
                'overview' => 'The General Medicine department provides comprehensive primary care and management of acute and chronic medical conditions.',
                'services' => json_encode(['Diabetes Management', 'Hypertension Care', 'Infectious Disease Treatment', 'Preventive Health Check-ups', 'Chronic Disease Management']),
                'facilities' => json_encode(['General OPD', 'Medical ICU', 'Diagnostic Lab', 'Health Screening Center'])
            ],
            [
                'name' => 'ENT',
                'code' => 'ENT',
                'description' => 'Ear, Nose, and Throat',
                'overview' => 'Our ENT department specializes in the diagnosis and treatment of disorders related to ear, nose, throat, head, and neck.',
                'services' => json_encode(['Hearing Tests', 'Endoscopic Sinus Surgery', 'Tonsillectomy', 'Voice Therapy', 'Sleep Apnea Treatment', 'Head & Neck Surgery']),
                'facilities' => json_encode(['ENT OPD', 'Audiometry Lab', 'Endoscopy Suite', 'Minor OT'])
            ],
            [
                'name' => 'Opthalmology',
                'code' => 'OPHT',
                'description' => 'Eye disorders',
                'overview' => 'The Ophthalmology department offers comprehensive eye care services from routine check-ups to advanced surgical procedures.',
                'services' => json_encode(['Cataract Surgery', 'LASIK', 'Retina Treatment', 'Glaucoma Management', 'Pediatric Eye Care', 'Corneal Transplant']),
                'facilities' => json_encode(['Eye OPD', 'Operation Theater', 'Optical Shop', 'Vision Testing Center'])
            ],
            [
                'name' => 'Psychiatry',
                'code' => 'PSY',
                'description' => 'Mental health',
                'overview' => 'Our Psychiatry department provides compassionate mental health care with a focus on diagnosis, treatment, and rehabilitation.',
                'services' => json_encode(['Depression Treatment', 'Anxiety Management', 'Addiction Counseling', 'Child Psychiatry', 'Psychotherapy', 'Psychiatric Evaluation']),
                'facilities' => json_encode(['Psychiatry OPD', 'Counseling Rooms', 'De-addiction Center', 'Psychiatric Ward'])
            ],
        ];

        foreach ($departments as $dept) {
            DB::table('departments')->updateOrInsert(
                ['code' => $dept['code']],
                [
                    'name' => $dept['name'],
                    'code' => $dept['code'],
                    'description' => $dept['description'],
                    'overview' => $dept['overview'],
                    'services' => $dept['services'],
                    'facilities' => $dept['facilities'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
