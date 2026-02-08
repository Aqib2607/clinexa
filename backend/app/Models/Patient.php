<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patient extends Model
{
    // HasApiTokens removed

    // No HasUuids as table uses BigInt ID

    protected $fillable = [
        'uhid',
        'name',
        'dob',
        'gender',
        'phone', // maps to contact_number in script? Script uses contact_number. Schema has phone.
        'contact_number', // Wait, schema has 'phone'. Verify script uses 'contact_number'.
        'email',
        'address',
        'guardian_name',
        'guardian_phone',
        'blood_group',
    ];

    protected $casts = [
        'dob' => 'date',
    ];

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}
