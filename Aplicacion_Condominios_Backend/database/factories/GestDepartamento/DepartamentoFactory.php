<?php

namespace Database\Factories\GestDepartamento;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\GestDepartamento\edificio;
class DepartamentoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            //
            'nombre_departamento' => $this->faker->word,
            'numero_habitaciones' => $this->faker->numberBetween(1,5),
            'numero_personas'  => $this->faker->numberBetween(1,7),
            'superficie' => $this->faker->randomFloat($nbMaxDecimals = 2, $min =0, $max=100),
            'disponibilidad' => true,
            'amoblado' => $this->faker->boolean(),
            'descripcion_departamento' => $this->faker->sentence(),
            'piso' => $this->faker->numberBetween(1,10),
            'imagen_departamento' => $this->faker->imageUrl($width = 640, $height = 480),
            'edificio_id' => edificio::factory()->create()->id
        ];
    }
    public function withoutTimestamps(){
        return $this->state(function (array $attributes){
            return [];
        });
    }
}
