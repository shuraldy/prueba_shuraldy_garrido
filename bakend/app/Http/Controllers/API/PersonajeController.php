<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Personaje;
use Illuminate\Http\Request;

class PersonajeController extends Controller
{
    public function index()
    {
        return Personaje::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'edad' => 'nullable|integer',
        ]);

        $personaje = Personaje::create($request->all());
        return response()->json($personaje, 201);
    }

    public function show(Personaje $personaje)
    {
        return $personaje;
    }

    public function update(Request $request, Personaje $personaje)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'edad' => 'nullable|integer',
        ]);

        $personaje->update($request->all());
        return response()->json($personaje, 200);
    }

    public function destroy(Personaje $personaje)
    {
        $personaje->delete();
        return response()->json(null, 204);
    }
}
