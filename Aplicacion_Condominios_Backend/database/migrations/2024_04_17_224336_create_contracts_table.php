<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->string('tipo_contrato');
            $table->date('fecha_inicio');
            $table->date('fecha_final')->nullable();
            $table->string('area');
            $table->string('cargo');
            $table->string('beneficios')->nullable();
            $table->integer('salario');

            $table->unsignedBigInteger('empleado');

            $table->foreign('empleado')
                ->references('id')
                ->on('employees')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contracts');
    }
}
