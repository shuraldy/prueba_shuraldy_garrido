<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Locacion extends Model
{
    protected $table = 'locaciones';
    protected $fillable = [
        'nombre', 'url'
    ];

    public function personaje()
    {
        return $this->belongsTo(Personaje::class);
    }
}
