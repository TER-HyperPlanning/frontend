# Table Standardization - Quick Reference Guide

## What Was Standardized

### 1. **Visual Design**
All tables now use a modern, clean card-based design:
- Rounded corners with subtle shadows
- Light gray header with gradient background
- Consistent padding and spacing (py-3, px-4)
- Professional borders with hover effects
- Better visual hierarchy with font weights

### 2. **Components Created/Updated**

| Component | Status | Changes |
|-----------|--------|---------|
| `Table.tsx` | ✅ Updated | New modern styling, gradient headers |
| `EmptyState.tsx` | ✨ New | Reusable empty state component |
| `tableStyles.ts` | ✨ New | Central styling constants |
| `FormationsTable.tsx` | ✅ Updated | New badges, icons, empty state |
| `TeachersTable.tsx` | ✅ Updated | New badges, icons, empty state |
| `ScolariteTable.tsx` | ✅ Updated | New badges, icons, empty state |
| `ModuleTable.tsx` | ✅ Updated | New badges, icons, empty state |
| `RoomsTable.tsx` | ✅ Updated | New badges, icons, empty state |
| `GroupTable.tsx` | ✅ Updated | New badges styling, better layout |

### 3. **Design System Assets**

#### Badge Styles ($BADGE_STYLES)
```
✅ active        - Emerald green for active status
⚠️ warning       - Amber for warnings
❌ error        - Red for errors  
ℹ️ info         - Blue for information
📋 secondary    - Purple for secondary info
🔇 inactive     - Gray for inactive status
+ outline variants for each (less prominent)
```

#### Action Button Styles ($ACTION_BUTTON_STYLES)
```
✏️ edit    → Amber hover on light amber background
🗑️ delete  → Red hover on light red background
👁️ view    → Blue hover on light blue background
👤 assign  → Green hover on light green background
```

#### Empty State Messages
- Centered layout with optional icon support
- Consistent title, subtitle, and message structure
- Proper spacing and typography

### 4. **Icon Library Standardization**
All tables now use **Lucide React Icons**:
- `Pencil` (16px) - Edit action
- `Trash2` (16px) - Delete action
- `Link2` (16px) - Assign/Link action
- `UserPlus` (15px) - User assignment

### 5. **Typography Improvements**
| Element | Style |
|---------|-------|
| Column Headers | Uppercase, semibold, gray-700 |
| Primary Text | Semibold, gray-900 |
| Secondary Text | Regular, gray-600 |
| Muted Text | Regular, gray-500 or gray-400 |

## Before & After

### Badge Example
**Before:** `<span className="badge badge-primary badge-outline badge-sm">`
**After:** `<span className={BADGE_STYLES['info-outline']}>`

### Action Button Example
**Before:** `<button className="btn btn-ghost btn-sm text-base-content/50 hover:text-warning">`
**After:** `<button className={ACTION_BUTTON_STYLES.edit}>`

### Empty State Example
**Before:**
```jsx
<TableCell colSpan={6} className="text-center text-base-content/50 py-16">
  Aucune formation enregistrée
</TableCell>
```
**After:**
```jsx
<EmptyState title="Aucune formation" message="Aucune formation enregistrée" />
```

## Implementation Instructions

### For All Tables
1. Import utilities at top of file
```tsx
import { BADGE_STYLES, ACTION_BUTTON_STYLES, EmptyState } from '@/utils/tableStyles'
import { Pencil, Trash2, Link2, UserPlus } from 'lucide-react'
```

2. Apply badge styles
```tsx
<span className={BADGE_STYLES.active}>Active</span>
<span className={BADGE_STYLES['info-outline']}>Info</span>
```

3. Apply action button styles
```tsx
<button className={ACTION_BUTTON_STYLES.edit}>
  <Pencil size={16} />
</button>
```

4. Use empty states
```tsx
<EmptyState title="No items" message="No items found" />
```

5. Right-align action columns
```tsx
<TableHeader className="text-right">Actions</TableHeader>
<TableCell className="text-right">
  <div className="flex items-center justify-end gap-1">
    {/* buttons */}
  </div>
</TableCell>
```

## Files Modified Summary
- **8 table components updated**
- **1 new utility file created** (`tableStyles.ts`)
- **1 new component created** (`EmptyState.tsx`)
- **1 documentation file created** (`TABLE_STANDARDIZATION.md`)

## Benefits
✅ Consistent visual appearance across entire app
✅ Faster development with reusable utilities
✅ Easier maintenance with centralized styles
✅ Better UX with professional design
✅ Responsive and accessible components
✅ Easy to update all tables by modifying constants

## Next Steps
1. Test all tables in browser to verify styling
2. Consider adding table sorting/filtering indicators
3. Potentially add table selection (checkboxes)
4. Expand utilities for additional badge types if needed
