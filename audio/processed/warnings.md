# Audio pipeline report

- **amb_stadium_crowd_chant_01** [D] 24.50s -> 24.50s {'passthrough': True}
- **amb_stadium_crowd_chant_02** [D] 27.00s -> 27.00s {'passthrough': True}
- **amb_stadium_crowd_low_loop_01** [D] 9.50s -> 9.50s {'passthrough': True} | loop candidate (crossfade 1.43s) | QA clean (仍建议人工试听一遍 — QA 不等于无缝保证)
- **amb_stadium_crowd_low_loop_02** [D] 15.00s -> 15.00s {'passthrough': True} | loop candidate (crossfade 2.00s) | QA clean (仍建议人工试听一遍 — QA 不等于无缝保证)
- **sfx_aerial_duel_contact_01** [A] 1.00s -> 0.92s {'floor_db': -120.0, 'trimmed': True, 'cut_head_ms': 55, 'cut_tail_ms': 25, 'sustain_w': 12}
- **sfx_ball_hit_crossbar_01** [B] 0.42s -> 0.41s {'floor_db': -120.0, 'trimmed': True, 'cut_head_ms': 15, 'cut_tail_ms': 0, 'sustain_w': 12, 'fade_out_ms': 86}
- **sfx_ball_hit_net_01** [B] 1.00s -> 0.96s {'floor_db': -79.1, 'trimmed': True, 'cut_head_ms': 35, 'cut_tail_ms': 0, 'sustain_w': 12, 'fade_out_ms': 212}
- **sfx_crowd_applause_01** [C] 5.00s -> 5.00s {'floor_db': -35.38935089111328, 'trimmed': False}
- **sfx_crowd_disappointment_01** [C] 1.50s -> 1.50s {'floor_db': -29.78061294555664, 'trimmed': False}
- **sfx_crowd_goal_celebration_01** [C] 9.50s -> 8.82s {'floor_db': -34.4, 'trimmed': True, 'cut_head_ms': 675, 'cut_tail_ms': 0, 'sustain_w': 12}
- **sfx_dribble_fast_loop_01** [A] 2.00s -> 1.80s {'floor_db': -120.0, 'trimmed': True, 'cut_head_ms': 15, 'cut_tail_ms': 185, 'sustain_w': 12} | loop candidate (crossfade 0.75s) ⚠ 需人工试听: RMS jump at seam 116.7 dB (>3); spectral centroid shift tail-vs-head 0->3209 Hz (>25%); hot transient near the blended head — may read as a repeating event
- **sfx_keeper_save_01** [A] 0.12s -> 0.11s {'floor_db': -120.0, 'trimmed': True, 'cut_head_ms': 15, 'cut_tail_ms': 0, 'sustain_w': 12}
- **sfx_kick_power_01** [A] 0.50s -> 0.47s {'floor_db': -90.5, 'trimmed': True, 'cut_head_ms': 25, 'cut_tail_ms': 0, 'sustain_w': 12}
- **sfx_pass_short_02-001** [A] 0.50s -> 0.10s {'floor_db': -120.0, 'trimmed': True, 'cut_head_ms': 110, 'cut_tail_ms': 290, 'sustain_w': 12}
- **sfx_pass_short_02-002** [A] 0.50s -> 0.09s {'floor_db': -120.0, 'trimmed': True, 'cut_head_ms': 90, 'cut_tail_ms': 325, 'sustain_w': 12}
- **sfx_referee_whistle_01** [B] 2.00s -> 1.95s {'floor_db': -67.5, 'trimmed': True, 'cut_head_ms': 50, 'cut_tail_ms': 0, 'sustain_w': 12, 'fade_out_ms': 400}
- **sfx_shot_01** [A] 0.35s -> 0.33s {'floor_db': -120.0, 'trimmed': True, 'cut_head_ms': 20, 'cut_tail_ms': 0, 'sustain_w': 12}
- **sfx_touch_heavy_01** [A] 0.50s -> 0.07s {'floor_db': -120.0, 'trimmed': True, 'cut_head_ms': 60, 'cut_tail_ms': 365, 'sustain_w': 12}
- **ui_button_click_01** [A] 0.50s -> 0.38s {'floor_db': -120.0, 'trimmed': True, 'cut_head_ms': 125, 'cut_tail_ms': 0, 'sustain_w': 12}
- **ui_button_press_heavy_tonal_01** [A] 1.50s -> 1.15s {'floor_db': -120.0, 'trimmed': True, 'cut_head_ms': 165, 'cut_tail_ms': 185, 'sustain_w': 12}
- **ui_toggle_01** [A] 0.50s -> 0.40s {'floor_db': -120.0, 'trimmed': True, 'cut_head_ms': 100, 'cut_tail_ms': 0, 'sustain_w': 12}

1 file(s) flagged for human listening.
