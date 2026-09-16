import { Component } from '@angular/core';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.html',
})
export class Admin {
    inspectSection(sectionName: string): void {
    alert(`Inspecting section: ${sectionName}`);
    }
}