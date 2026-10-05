<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use App\Models\Category;
use App\Support\WhatsappContact;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    private const FEATURED_COUNT = 8;

    private const QUARTIER_COUNT = 6;

    /** Annonces published within this many days get the "Nouveau" badge. */
    private const NEW_FOR_DAYS = 14;

    /**
     * Public home page for guests and students. Owners and admins keep
     * landing on their dashboard.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user && $user->role?->name !== 'etudiant') {
            return redirect()->route($user->homeRouteName());
        }

        return Inertia::render('Home', [
            'featured' => $this->featured($user),
            'quartiers' => $this->quartiers(),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Same visibility rules as the public search page, in Casablanca only.
     */
    private function visible(): Builder
    {
        return Annonce::query()
            ->where('status', 'disponible')
            ->where('is_suspended', false)
            ->where('city', 'Casablanca');
    }

    /**
     * Latest listings, with photo, badges and the WhatsApp contact state.
     *
     * @return array<int, array<string, mixed>>
     */
    private function featured($user): array
    {
        return $this->visible()
            ->with(['mainPhoto', 'category:id,name', 'user:id,is_verified,phone', 'user.subscription:id,user_id,type,expires_at'])
            ->latest()
            ->limit(self::FEATURED_COUNT)
            ->get()
            ->map(fn (Annonce $annonce) => [
                'id' => $annonce->id,
                'title' => $annonce->title,
                'quartier' => $annonce->quartier,
                'price' => $annonce->price,
                'surface' => $annonce->surface,
                'category' => $annonce->category?->name,
                'main_photo' => $annonce->mainPhoto?->path,
                'is_new' => $annonce->created_at?->gte(now()->subDays(self::NEW_FOR_DAYS)) ?? false,
                'is_certified_pro' => $annonce->ownerIsCertifiedPro(),
                'whatsapp_contact' => WhatsappContact::stateFor($user, $annonce),
            ])
            ->all();
    }

    /**
     * Quartiers with the most listings, their lowest price, and the photo
     * of that cheapest listing for the tile.
     *
     * @return array<int, array<string, mixed>>
     */
    private function quartiers(): array
    {
        $rows = $this->visible()
            ->select('quartier', DB::raw('MIN(price) as min_price'), DB::raw('COUNT(*) as total'))
            ->groupBy('quartier')
            ->orderByDesc('total')
            ->orderBy('quartier')
            ->limit(self::QUARTIER_COUNT)
            ->get();

        return $rows->map(function ($row) {
            $cheapest = $this->visible()
                ->where('quartier', $row->quartier)
                ->whereHas('photos')
                ->with('mainPhoto')
                ->orderBy('price')
                ->first();

            return [
                'name' => $row->quartier,
                'min_price' => (float) $row->min_price,
                'total' => (int) $row->total,
                'photo' => $cheapest?->mainPhoto?->path,
            ];
        })->all();
    }
}
