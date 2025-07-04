<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Episodio extends Model
{
    protected $fillable = [
        'nombre', 'fecha_emision', 'codigo_episodio', 'url'
    ];

    public function personaje()
    {
        return $this->belongsTo(Personaje::class);
    }
}

