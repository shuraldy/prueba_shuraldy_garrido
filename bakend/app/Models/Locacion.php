<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Locacion extends Model
{
    /**
     * The attributes that should be hidden for serialization.
     * 
     * @var array
     */
    protected $hidden = ['url', 'created_at', 'updated_at'];
    protected $table = 'locaciones';
    protected $fillable = [
        'nombre', 'url'
    ];

    public function personaje()
    {
        return $this->belongsTo(Personaje::class);
    }
}
