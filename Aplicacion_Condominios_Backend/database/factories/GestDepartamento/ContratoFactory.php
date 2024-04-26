<?php

namespace Database\Factories\GestDepartamento;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\GestDepartamento\Departamento;
class ContratoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            //generar datos aleatorios
            'fecha_inicio_contrato' => $this->faker->date(),
            'fecha_fin_contrato' => $this->faker->date(),
            'precio_contrato' => $this->faker->randomFloat(2, 1000, 10000),
            'tipo_contrato' => $this->faker->randomElement(['alquiler', 'venta']),
            'vigente_contrato' => $this->faker->boolean(),
            'departamento_id' => Departamento::all()->random()->id,
            
        ];
    }
}
