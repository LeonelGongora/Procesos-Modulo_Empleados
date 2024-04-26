<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GestDepartamento\Contrato;
class ContratoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        Contrato::factory()->count(7)->create();
    }
}
