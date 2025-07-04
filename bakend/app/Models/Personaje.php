<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Personaje extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre', 'estado', 'especie', 'tipo', 'genero', 'imagen', 'url', 'creado'
    ];

    public function episodios()
    {
        return $this->hasMany(Episodio::class);
    }

    public function locacion()
    {
        return $this->hasOne(Locacion::class);
    }
}


