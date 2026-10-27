import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FeatureCard } from '../../../models/dashboard/features';

@Component({
  selector: 'app-dashboard-feature',
  imports: [RouterLink],
  templateUrl: './dashboard-features.component.html',
  styleUrl: './dashboard-features.component.css',
})
export class DashboardFeature {
  public card = input.required<FeatureCard>();
}
