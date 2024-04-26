<?php

namespace Database\Factories\GestDepartamento;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\GestDepartamento\Bloque;
class EdificioFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    //protected $model = edificio::class;
    public function definition()
    {
        return [
            //
            'nombre_edificio' => $this->faker->name,
            'descripcion_edificio' => $this->faker->text(200),
            'imagen_edificio' => $this->faker->imageUrl($width = 640, $height = 480),
            'cantidad_pisos' => $this->faker->numberBetween(1, 10),
            'bloque_id' => Bloque::factory()->create()->id
        ];
    }
    public function withoutTimestamps()
    {
        return $this->state(function (array $attributes) {
            return [];
        });
    }
}
