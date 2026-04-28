'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import EnrollmentForm from './components/EnrollmentForm';

interface School {
  id: number;
  name: string;
  address?: string;
}

export default function SpecialNeedsSchoolsPage() {
  // ... existing code (fetch schools, render grid, etc.) ...

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const openEnrollmentModal = (school: School) => {
    setSelectedSchool(school);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Existing grid */}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>طلب التحاق لطفل من ذوي الاحتياجات الخاصة</DialogTitle>
          <DialogDescription>
            يرجى ملء البيانات التالية لتقديم طلب الالتحاق بالمدرسة{' '}
            <strong>{selectedSchool?.name}</strong>
          </DialogDescription>
          {/* Only render form if selectedSchool exists, so schoolId is always defined */}
          {selectedSchool && (
            <EnrollmentForm
              schoolId={selectedSchool.id}
              onSuccess={() => setIsModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}