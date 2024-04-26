<?php

namespace Database\Factories\GestDepartamento;

use Illuminate\Database\Eloquent\Factories\Factory;

class ResidenteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $apellidos = $this->faker->lastName . ' ' . $this->faker->lastName;

        return [
            //
            'nombre_residente' => $this->faker->name,
            'apellidos_residente' => $apellidos,
            'cedula_residente' => $this->faker->unique()->randomNumber(8),
            'telefono_residente' => $this->faker->phoneNumber,
            'fecha_nacimiento_residente' => $this->faker->date(),
            'tipo_residente' => $this->faker->randomElement(['propietario', 'inquilino']),
            'nacionalidad_residente' => $this->faker->country,
            'email_residente' => $this->faker->unique()->safeEmail,
            'genero_residente' => $this->faker->randomElement(['masculino', 'femenino']),
            'estado_residente' => false, 
            'imagen_residente' => $this->faker->imageUrl($width = 640, $height = 480),
            'contrato_id' => $this->faker->numberBetween(1, 10)           
        ];
    }
}
