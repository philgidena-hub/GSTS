import { useState } from 'react';
import styled from '@emotion/styled';
import { Plus, Edit2, Trash2, Save, X, Search, HelpCircle, ChevronDown } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useContentStore } from '../../stores/contentStore';
import type { FAQ } from '../../types';

const PageWrapper = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-neutral-900);
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  width: 300px;

  input {
    border: none;
    outline: none;
    flex: 1;
    font-size: 0.9375rem;
  }

  svg {
    color: var(--color-neutral-400);
  }
`;

const CategoryFilter = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${({ $active }) => ($active ? 'var(--color-primary-600)' : 'var(--color-neutral-200)')};
  background: ${({ $active }) => ($active ? 'var(--color-primary-600)' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : 'var(--color-neutral-600)')};

  &:hover {
    border-color: var(--color-primary-600);
  }
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

const FAQHeader = styled.div<{ $expanded?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--color-neutral-50);
  }
`;

const FAQIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--color-primary-100);
  color: var(--color-primary-600);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const FAQContent = styled.div`
  flex: 1;
`;

const FAQQuestion = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 0.25rem;
  line-height: 1.4;
`;

const FAQCategory = styled.span`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  background: var(--color-neutral-100);
  color: var(--color-neutral-600);
  border-radius: var(--radius-sm);
`;

const FAQAnswer = styled.div<{ $expanded?: boolean }>`
  padding: 0 1.25rem 1.25rem;
  padding-left: calc(1.25rem + 40px + 1rem);
  font-size: 0.9375rem;
  color: var(--color-neutral-600);
  line-height: 1.7;
  display: ${({ $expanded }) => ($expanded ? 'block' : 'none')};
`;

const FAQActions = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
`;

const ActionButton = styled.button<{ $variant?: 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $variant }) =>
    $variant === 'danger' ? 'transparent' : 'transparent'};
  color: ${({ $variant }) =>
    $variant === 'danger' ? 'var(--color-accent-error)' : 'var(--color-neutral-400)'};

  &:hover {
    background: ${({ $variant }) =>
      $variant === 'danger' ? '#fef2f2' : 'var(--color-neutral-100)'};
    color: ${({ $variant }) =>
      $variant === 'danger' ? '#dc2626' : 'var(--color-neutral-600)'};
  }
`;

const ExpandButton = styled.button<{ $expanded?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-neutral-400);
  cursor: pointer;
  transition: all 0.2s;
  transform: rotate(${({ $expanded }) => ($expanded ? '180deg' : '0deg')});

  &:hover {
    background: var(--color-neutral-100);
    color: var(--color-neutral-600);
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-neutral-100);
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-neutral-900);
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-neutral-100);
  color: var(--color-neutral-600);
  cursor: pointer;

  &:hover {
    background: var(--color-neutral-200);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--color-neutral-100);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-neutral-100);
`;

const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  font-size: 0.9375rem;
  color: var(--color-neutral-500);
  margin-bottom: 1.5rem;
`;

const SuccessMessage = styled.div`
  padding: 0.75rem 1rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-md);
  color: #16a34a;
  font-size: 0.875rem;
`;

const categoryOptions = ['General', 'Membership', 'Projects', 'Events', 'Technical'];

interface FAQFormData {
  question: string;
  answer: string;
  category: string;
}

const initialFormData: FAQFormData = {
  question: '',
  answer: '',
  category: 'General',
};

export const FAQManager = () => {
  const { faqs, addFAQ, updateFAQ, deleteFAQ, isLoading } = useContentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState<FAQFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Get unique categories from FAQs
  const categories = ['All', ...new Set(faqs.map((f) => f.category))];

  const filteredFAQs = faqs.filter((f) => {
    const matchesSearch =
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || f.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenModal = (faq?: FAQ) => {
    if (faq) {
      setEditingFAQ(faq);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
      });
    } else {
      setEditingFAQ(null);
      setFormData(initialFormData);
    }
    setSuccessMessage('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFAQ(null);
    setFormData(initialFormData);
    setSuccessMessage('');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.question || !formData.answer) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      if (editingFAQ) {
        await updateFAQ(editingFAQ.id, formData);
        setSuccessMessage('FAQ updated successfully!');
      } else {
        await addFAQ(formData);
        setSuccessMessage('FAQ created successfully!');
      }

      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await deleteFAQ(id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <PageWrapper>
      <Header>
        <Title>Manage FAQs</Title>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <SearchBox>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBox>
          <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => handleOpenModal()}>
            Add FAQ
          </Button>
        </div>
      </Header>

      <CategoryFilter>
        {categories.map((category) => (
          <FilterButton
            key={category}
            $active={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </FilterButton>
        ))}
      </CategoryFilter>

      {filteredFAQs.length === 0 ? (
        <EmptyState>
          <EmptyTitle>No FAQs found</EmptyTitle>
          <EmptyText>
            {searchQuery || activeCategory !== 'All'
              ? 'Try adjusting your search or filter'
              : 'Get started by creating your first FAQ'}
          </EmptyText>
          {!searchQuery && activeCategory === 'All' && (
            <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => handleOpenModal()}>
              Add FAQ
            </Button>
          )}
        </EmptyState>
      ) : (
        <FAQList>
          {filteredFAQs.map((faq) => (
            <FAQCard key={faq.id} variant="default">
              <FAQHeader
                $expanded={expandedIds.includes(faq.id)}
                onClick={() => toggleExpand(faq.id)}
              >
                <FAQIcon>
                  <HelpCircle size={20} />
                </FAQIcon>
                <FAQContent>
                  <FAQQuestion>{faq.question}</FAQQuestion>
                  <FAQCategory>{faq.category}</FAQCategory>
                </FAQContent>
                <FAQActions onClick={(e) => e.stopPropagation()}>
                  <ActionButton onClick={() => handleOpenModal(faq)}>
                    <Edit2 size={16} />
                  </ActionButton>
                  <ActionButton $variant="danger" onClick={(e) => handleDelete(faq.id, e)}>
                    <Trash2 size={16} />
                  </ActionButton>
                </FAQActions>
                <ExpandButton $expanded={expandedIds.includes(faq.id)}>
                  <ChevronDown size={20} />
                </ExpandButton>
              </FAQHeader>
              <FAQAnswer $expanded={expandedIds.includes(faq.id)}>
                {faq.answer}
              </FAQAnswer>
            </FAQCard>
          ))}
        </FAQList>
      )}

      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

              <Input
                label="Question *"
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="What question do users frequently ask?"
                fullWidth
              />

              <Textarea
                label="Answer *"
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                placeholder="Provide a clear and helpful answer..."
                fullWidth
                style={{ minHeight: '150px' }}
              />

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--color-neutral-200)',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    background: 'white',
                  }}
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                leftIcon={<Save size={18} />}
                onClick={handleSave}
                isLoading={isSaving || isLoading}
              >
                {editingFAQ ? 'Save Changes' : 'Create FAQ'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};
