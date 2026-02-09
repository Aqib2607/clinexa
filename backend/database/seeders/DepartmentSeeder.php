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
            ['name' => 'Cardiology', 'code' => 'CARD', 'description' => 'Heart and cardiovascular system'],
            ['name' => 'Neurology', 'code' => 'NEUR', 'description' => 'Nervous system'],
            ['name' => 'Orthopedics', 'code' => 'ORTH', 'description' => 'Bones and muscles'],
            ['name' => 'Pediatrics', 'code' => 'PED', 'description' => 'Medical care of infants, children, and adolescents'],
            ['name' => 'Gynecology', 'code' => 'GYN', 'description' => 'Female reproductive system'],
            ['name' => 'Dermatology', 'code' => 'DERM', 'description' => 'Skin, hair, and nails'],
            ['name' => 'General Medicine', 'code' => 'GENM', 'description' => 'Adult diseases'],
            ['name' => 'ENT', 'code' => 'ENT', 'description' => 'Ear, Nose, and Throat'],
            ['name' => 'Opthalmology', 'code' => 'OPHT', 'description' => 'Eye disorders'],
            ['name' => 'Psychiatry', 'code' => 'PSY', 'description' => 'Mental health'],
        ];

        foreach ($departments as $dept) {
            DB::table('departments')->insert([
                'name' => $dept['name'],
                'code' => $dept['code'],
                'description' => $dept['description'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
