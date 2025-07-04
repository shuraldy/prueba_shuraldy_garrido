<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Personaje;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PersonajeController extends Controller
{
    public function index()
    {
        return Personaje::all();
    }

    public function store(Request $request)
    {
        Log::info('--- INICIO DE IMPORTACIÓN EN API CONTROLLER ---');
        Log::info('Request recibido:', $request->all());

        try {
            $validatedData = $request->validate([
                'nombre' => 'required|string|max:255',
                'estado' => 'required|string|max:255',
                'especie' => 'required|string|max:255',
                'tipo' => 'nullable|string|max:255',
                'genero' => 'required|string|max:255',
                'imagen' => 'required|string|url',
                'url' => 'required|string|url',
                'creado' => 'required|string',
                'locacion' => 'sometimes|array',
                'locacion.nombre' => 'required_with:locacion|string|max:255',
                'locacion.url' => 'nullable|string|url',
                'episodios' => 'sometimes|array',
                'episodios.*.nombre' => 'required_with:episodios|string|max:255',
                'episodios.*.fecha_emision' => 'required_with:episodios|string|max:255',
                'episodios.*.codigo_episodio' => 'required_with:episodios|string|max:255',
                'episodios.*.url' => 'nullable|string|url',
            ]);

            Log::info('Datos validados con éxito.', $validatedData);

            $personaje = DB::transaction(function () use ($validatedData) {
                $personajeData = collect($validatedData)->only([
                    'nombre', 'estado', 'especie', 'tipo', 'genero', 'imagen', 'url', 'creado'
                ])->toArray();

                $personaje = Personaje::create($personajeData);
                Log::info('Personaje creado con ID: ' . $personaje->id);

                if (!empty($validatedData['locacion'])) {
                    Log::info('Intentando guardar locación: ', $validatedData['locacion']);
                    $locacion = $personaje->locacion()->create($validatedData['locacion']);
                    Log::info('Locación guardada con ID: ' . $locacion->id);
                }

                if (!empty($validatedData['episodios'])) {
                    Log::info('Intentando guardar ' . count($validatedData['episodios']) . ' episodios...');
                    $episodios = $personaje->episodios()->createMany($validatedData['episodios']);
                    Log::info('Episodios guardados: ' . $episodios->count());
                }

                return $personaje;
            });

            return response()->json([
                'message' => 'Personaje, locación y episodios guardados correctamente.',
                'personaje_id' => $personaje->id
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Error de validación:', $e->errors());
            return response()->json([
                'message' => 'Datos inválidos. Por favor, revisa la información enviada.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error inesperado durante la importación: ' . $e->getMessage());
            return response()->json([
                'message' => 'Ocurrió un error inesperado en el servidor.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Personaje $personaje)
    {
        return $personaje;
    }

    public function update(Request $request, Personaje $personaje)
    {
        // NOTE: La lógica de actualización no fue solicitada, se mantiene la original.
        $request->validate([
            'nombre' => 'required|string|max:255',
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
