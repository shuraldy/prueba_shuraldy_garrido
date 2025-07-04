<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Episodio extends Model
{
    /**
     * The attributes that should be hidden for serialization.
     * 
     * @var array
     */
    protected $hidden = ['url', 'created_at', 'updated_at'];
    protected $fillable = [
        'nombre', 'fecha_emision', 'codigo_episodio', 'url'
    ];

    public function personaje()
    {
        return $this->belongsTo(Personaje::class);
    }
}

