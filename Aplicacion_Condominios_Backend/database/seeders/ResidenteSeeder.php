<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GestDepartamento\Residente;

class ResidenteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        Residente::factory()->count(8)->create();
    }
}
