<?php

namespace App\Http\Controllers;

use App\Models\Personaje;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PersonajeController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        Log::info('--- INICIO DE IMPORTACIÓN ---');
        Log::info('Request recibido:', $request->all());

        try {
            // 1. Validar los datos de entrada
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

            // 2. Usar una transacción para garantizar la integridad de los datos
            $personaje = DB::transaction(function () use ($validatedData) {
                // Aislar los datos del personaje
                $personajeData = collect($validatedData)->only([
                    'nombre', 'estado', 'especie', 'tipo', 'genero', 'imagen', 'url', 'creado'
                ])->toArray();

                // Crear el personaje
                $personaje = Personaje::create($personajeData);
                Log::info('Personaje creado con ID: ' . $personaje->id);

                // Guardar la locación si existe
                if (!empty($validatedData['locacion'])) {
                    Log::info('Intentando guardar locación: ', $validatedData['locacion']);
                    try {
                        $locacion = $personaje->locacion()->create($validatedData['locacion']);
                        Log::info('Locación guardada con ID: ' . $locacion->id);
                    } catch (\Exception $e) {
                        Log::error('Error al guardar locación: ' . $e->getMessage());
                        throw $e;
                    }
                } else {
                    Log::info('No se proporcionó locación.');
                }

                // Guardar los episodios si existen
                if (!empty($validatedData['episodios'])) {
                    Log::info('Intentando guardar ' . count($validatedData['episodios']) . ' episodios...');
                    try {
                        $episodios = $personaje->episodios()->createMany($validatedData['episodios']);
                        Log::info('Episodios guardados: ' . $episodios->count());
                    } catch (\Exception $e) {
                        Log::error('Error al guardar episodios: ' . $e->getMessage());
                        throw $e;
                    }
                } else {
                    Log::info('No se proporcionaron episodios.');
                }

                return $personaje;
            });

            // 3. Devolver una respuesta de éxito
            return response()->json([
                'message' => 'Personaje, locación y episodios guardados correctamente.',
                'personaje_id' => $personaje->id
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Capturar errores de validación
            Log::error('Error de validación:', $e->errors());
            return response()->json([
                'message' => 'Datos inválidos. Por favor, revisa la información enviada.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // Capturar cualquier otro error
            Log::error('Error inesperado durante la importación: ' . $e->getMessage());
            return response()->json([
                'message' => 'Ocurrió un error inesperado en el servidor.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
