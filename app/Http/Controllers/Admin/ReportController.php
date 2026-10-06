<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    /**
     * All reports, the ones to review first.
     */
    public function index(): Response
    {
        $reports = Report::query()
            ->with(['annonce:id,user_id,title,quartier,status,is_suspended', 'annonce.user:id,name', 'user:id,name,email'])
            ->orderByRaw("CASE WHEN status = 'nouveau' THEN 0 ELSE 1 END")
            ->latest()
            ->get()
            ->map(fn (Report $report) => [
                'id' => $report->id,
                'reason' => Report::REASONS[$report->reason] ?? $report->reason,
                'message' => $report->message,
                'status' => $report->status,
                'created_at' => $report->created_at->toIso8601String(),
                'handled_at' => $report->handled_at?->toIso8601String(),
                'reporter' => $report->user?->only(['name', 'email']),
                'annonce' => $report->annonce ? [
                    'id' => $report->annonce->id,
                    'title' => $report->annonce->title,
                    'quartier' => $report->annonce->quartier,
                    'status' => $report->annonce->status,
                    'is_suspended' => $report->annonce->is_suspended,
                    'owner' => $report->annonce->user?->name,
                ] : null,
            ]);

        return Inertia::render('Admin/Reports/Index', [
            'reports' => $reports,
        ]);
    }

    /**
     * Close a report as handled (optionally suspending the annonce) or
     * dismiss it.
     */
    public function update(Request $request, Report $report): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['traite', 'rejete'])],
            'suspend' => ['sometimes', 'boolean'],
        ]);

        $suspend = $validated['status'] === 'traite' && ($validated['suspend'] ?? false);

        DB::transaction(function () use ($report, $validated, $suspend, $request) {
            $report->update([
                'status' => $validated['status'],
                'handled_by' => $request->user()->id,
                'handled_at' => now(),
            ]);

            if ($suspend) {
                $report->annonce->update(['is_suspended' => true]);
            }
        });

        return back()->with('success', match (true) {
            $suspend => 'Annonce suspendue et signalement traité.',
            $validated['status'] === 'traite' => 'Signalement marqué comme traité.',
            default => 'Signalement rejeté.',
        });
    }
}
