import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

/**
 * Editor ricorsivo per array di JSON (anche innestati).
 * Ogni livello di array è una lista drag&drop indipendente: gli elementi si possono
 * riordinare (swap di posizione) trascinandoli; i valori primitivi sono editabili inline.
 */
@Component({
  selector: 'ngx-json-array-editor',
  templateUrl: './json-array-editor.component.html',
  styleUrls: ['./json-array-editor.component.scss'],
})
export class JsonArrayEditorComponent {
  @Input() items: any[] = [];
  @Input() depth = 0;
  @Output() changed = new EventEmitter<void>();

  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    this.changed.emit();
  }

  onValueChanged(): void {
    this.changed.emit();
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  isPrimitive(value: any): boolean {
    return value === null || typeof value !== 'object';
  }

  isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  isNumber(value: any): boolean {
    return typeof value === 'number';
  }

  objectKeys(value: any): string[] {
    return value ? Object.keys(value) : [];
  }

  typeOf(value: any): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
