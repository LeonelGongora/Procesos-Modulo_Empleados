<?php

namespace App\Models\PreAvisoModel;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreAvisoModel extends Model
{
    use HasFactory;
    protected $table = 'preavisos';

    protected $fillable = ['id', 'departamento_id','descripcion','monto
    ','fecha_cobro'];
}
