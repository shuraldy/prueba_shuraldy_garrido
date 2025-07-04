<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Personaje;
use App\Models\Episodio;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ReporteadorController extends Controller
{
    /**
     * Genera reportes dinámicos basados en filtros proporcionados.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function generar(Request $request)
    {
        // Reglas de validación para los diferentes tipos de reporte
        $validator = Validator::make($request->all(), [
            'tipo' => 'required|string|in:estado,locacion,episodios_por_personaje,personajes_por_episodio,episodios_por_fecha',
            'valor' => 'required_if:tipo,estado,locacion,episodios_por_personaje,personajes_por_episodio|string|max:255',
            'fecha_inicio' => 'required_if:tipo,episodios_por_fecha|date',
            'fecha_fin' => 'required_if:tipo,episodios_por_fecha|date|after_or_equal:fecha_inicio',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Parámetros inválidos', 'detalles' => $validator->errors()], 400);
        }

        $tipo = $request->input('tipo');
        $valor = $request->input('valor');

        try {
            switch ($tipo) {
                case 'estado':
                    $resultado = Personaje::where('estado', $valor)
                        ->with('locacion', 'episodios')
                        ->get();
                    break;

                case 'locacion':
                    $resultado = Personaje::whereHas('locacion', function ($query) use ($valor) {
                        $query->where('nombre', 'like', '%' . $valor . '%');
                    })->with('locacion', 'episodios')->get();
                    break;

                case 'episodios_por_personaje':
                    $personaje = Personaje::where('nombre', 'like', '%' . $valor . '%')->with('episodios')->first();
                    $resultado = $personaje ? $personaje->episodios : [];
                    break;

                case 'personajes_por_episodio':
                    $resultado = Personaje::whereHas('episodios', function ($query) use ($valor) {
                        $query->where('nombre', 'like', '%' . $valor . '%');
                    })->with('locacion', 'episodios')->get();
                    break;

                case 'episodios_por_fecha':
                    $fecha_inicio = Carbon::parse($request->input('fecha_inicio'))->format('Y-m-d');
                    $fecha_fin = Carbon::parse($request->input('fecha_fin'))->format('Y-m-d');
                    
                    // Usamos whereRaw para convertir el campo de texto de la fecha a un formato de fecha real en la consulta
                    // Esto es necesario porque el formato en la DB es 'December 16, 2013'
                    $resultado = Episodio::whereRaw("STR_TO_DATE(fecha_emision, '%M %d, %Y') BETWEEN ? AND ?", [$fecha_inicio, $fecha_fin])
                        ->get()
                        ->sortBy(function($episodio) {
                            // Ordenamos los resultados en PHP porque el orden en la DB con el formato de texto no es fiable
                            return Carbon::parse($episodio->fecha_emision);
                        })->values(); // Usamos values() para resetear las keys del array
                    break;
                
                default:
                    return response()->json(['error' => 'Tipo de reporte no soportado'], 400);
            }

            // Si el resultado es una colección de Personajes, la transformamos para aplanar las relaciones
            if ($resultado instanceof \Illuminate\Database\Eloquent\Collection && $resultado->isNotEmpty() && $resultado->first() instanceof Personaje) {
                $resultado = $resultado->map(function ($personaje) {
                    return [
                        'id' => $personaje->id,
                        'nombre' => $personaje->nombre,
                        'estado' => $personaje->estado,
                        'especie' => $personaje->especie,
                        'genero' => $personaje->genero,
                        'imagen' => $personaje->imagen,
                        'locacion' => $personaje->locacion ? $personaje->locacion->nombre : 'N/A',
                        'episodios' => $personaje->episodios->pluck('nombre')->implode(', '),
                    ];
                });
            }

            return response()->json($resultado);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Ocurrió un error al generar el reporte.', 'mensaje' => $e->getMessage()], 500);
        }
    }
}
