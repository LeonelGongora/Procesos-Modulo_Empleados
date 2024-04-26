<?php

namespace App\Models\CommonArea;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommonArea extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_common_area';

    protected $fillable = [
        'common_area_name',
        'description',
        'capacity',
        'url_image'
    ];

    public function equipments()
    {
        return $this->hasMany(Equipment::class, 'id_common_area');
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'id_common_area');
    }

    public function policies()
    {
        return $this->hasMany(Policy::class, 'id_common_area');
    }
}
