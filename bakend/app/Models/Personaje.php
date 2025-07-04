<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Personaje extends Model
{
    use HasFactory;

    /**
     * The attributes that should be hidden for serialization.
     * 
     * @var array
     */
    protected $hidden = ['url', 'creado', 'created_at', 'updated_at'];

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


