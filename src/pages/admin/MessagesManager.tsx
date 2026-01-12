import { useState } from 'react';
import styled from '@emotion/styled';
import { Search, Mail, Phone, Calendar, Trash2, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';

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

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const FilterTab = styled.button<{ $active?: boolean }>`
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

const MessagesContainer = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 1.5rem;
  min-height: 600px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MessagesList = styled.div`
  background: white;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-neutral-100);
  overflow: hidden;
`;

const MessageItem = styled.div<{ $selected?: boolean; $unread?: boolean }>`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-neutral-100);
  cursor: pointer;
  background: ${({ $selected, $unread }) =>
    $selected
      ? 'var(--color-primary-50)'
      : $unread
      ? 'var(--color-neutral-50)'
      : 'white'};
  transition: all 0.2s;

  &:hover {
    background: ${({ $selected }) =>
      $selected ? 'var(--color-primary-50)' : 'var(--color-neutral-50)'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const MessageSender = styled.div<{ $unread?: boolean }>`
  font-weight: ${({ $unread }) => ($unread ? '600' : '500')};
  color: var(--color-neutral-900);
  font-size: 0.9375rem;
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: var(--color-neutral-400);
`;

const MessageSubject = styled.div<{ $unread?: boolean }>`
  font-weight: ${({ $unread }) => ($unread ? '500' : '400')};
  color: var(--color-neutral-700);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const MessagePreview = styled.div`
  font-size: 0.8125rem;
  color: var(--color-neutral-500);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UnreadDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary-600);
  margin-right: 0.5rem;
`;

const MessageDetail = styled.div`
  background: white;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-neutral-100);
  overflow: hidden;
`;

const MessageDetailHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-neutral-100);
`;

const MessageDetailTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 1rem;
`;

const SenderInfo = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

const SenderAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-primary-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-600);
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
`;

const SenderDetails = styled.div`
  flex: 1;
`;

const SenderName = styled.div`
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 0.25rem;
`;

const SenderContact = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.8125rem;
  color: var(--color-neutral-500);
`;

const ContactItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;

  svg {
    color: var(--color-neutral-400);
  }
`;

const MessageDetailBody = styled.div`
  padding: 1.5rem;
`;

const MessageContent = styled.div`
  font-size: 0.9375rem;
  color: var(--color-neutral-700);
  line-height: 1.7;
  white-space: pre-wrap;
`;

const MessageDetailFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid var(--color-neutral-100);
  display: flex;
  gap: 1rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 4rem 2rem;
  text-align: center;
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--color-neutral-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-neutral-400);
  margin-bottom: 1rem;
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
`;

// Sample messages data
const sampleMessages = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 234 567 890',
    subject: 'Membership Inquiry',
    message: 'Hello,\n\nI am interested in becoming a member of GSTS. Could you please provide more information about the membership process and benefits?\n\nI am currently working as a researcher at MIT and would love to contribute to the organization\'s mission.\n\nThank you for your time.\n\nBest regards,\nJohn',
    date: '2024-01-15T10:30:00',
    read: false,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    phone: '+1 987 654 321',
    subject: 'Partnership Proposal',
    message: 'Dear GSTS Team,\n\nI represent TechCorp and we are interested in exploring partnership opportunities with your organization.\n\nPlease let me know a convenient time to discuss this further.\n\nRegards,\nSarah',
    date: '2024-01-14T15:45:00',
    read: true,
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.b@university.edu',
    phone: '',
    subject: 'Research Collaboration',
    message: 'Hi,\n\nI am a professor at Stanford University and would like to discuss potential research collaboration opportunities.\n\nLooking forward to hearing from you.\n\nBest,\nMichael',
    date: '2024-01-13T09:00:00',
    read: true,
  },
];

export const MessagesManager = () => {
  const [messages, setMessages] = useState(sampleMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<typeof sampleMessages[0] | null>(null);

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' || (filter === 'unread' && !m.read) || (filter === 'read' && m.read);
    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleSelectMessage = (message: typeof sampleMessages[0]) => {
    setSelectedMessage(message);
    if (!message.read) {
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, read: true } : m))
      );
    }
  };

  const handleMarkUnread = () => {
    if (selectedMessage) {
      setMessages((prev) =>
        prev.map((m) => (m.id === selectedMessage.id ? { ...m, read: false } : m))
      );
      setSelectedMessage({ ...selectedMessage, read: false });
    }
  };

  const handleDelete = () => {
    if (selectedMessage && window.confirm('Are you sure you want to delete this message?')) {
      setMessages((prev) => prev.filter((m) => m.id !== selectedMessage.id));
      setSelectedMessage(null);
    }
  };

  return (
    <PageWrapper>
      <Header>
        <Title>Contact Messages {unreadCount > 0 && `(${unreadCount} unread)`}</Title>
        <SearchBox>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBox>
      </Header>

      <FilterTabs>
        <FilterTab $active={filter === 'all'} onClick={() => setFilter('all')}>
          All Messages
        </FilterTab>
        <FilterTab $active={filter === 'unread'} onClick={() => setFilter('unread')}>
          Unread ({unreadCount})
        </FilterTab>
        <FilterTab $active={filter === 'read'} onClick={() => setFilter('read')}>
          Read
        </FilterTab>
      </FilterTabs>

      <MessagesContainer>
        <MessagesList>
          {filteredMessages.length === 0 ? (
            <EmptyState>
              <EmptyTitle>No messages</EmptyTitle>
              <EmptyText>
                {searchQuery || filter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No contact messages yet'}
              </EmptyText>
            </EmptyState>
          ) : (
            filteredMessages.map((message) => (
              <MessageItem
                key={message.id}
                $selected={selectedMessage?.id === message.id}
                $unread={!message.read}
                onClick={() => handleSelectMessage(message)}
              >
                <MessageHeader>
                  <MessageSender $unread={!message.read}>
                    {!message.read && <UnreadDot />}
                    {message.name}
                  </MessageSender>
                  <MessageTime>{formatDate(message.date)}</MessageTime>
                </MessageHeader>
                <MessageSubject $unread={!message.read}>{message.subject}</MessageSubject>
                <MessagePreview>{message.message.split('\n')[0]}</MessagePreview>
              </MessageItem>
            ))
          )}
        </MessagesList>

        <MessageDetail>
          {selectedMessage ? (
            <>
              <MessageDetailHeader>
                <MessageDetailTitle>{selectedMessage.subject}</MessageDetailTitle>
                <SenderInfo>
                  <SenderAvatar>
                    {selectedMessage.name.split(' ').map((n) => n[0]).join('')}
                  </SenderAvatar>
                  <SenderDetails>
                    <SenderName>{selectedMessage.name}</SenderName>
                    <SenderContact>
                      <ContactItem>
                        <Mail size={14} />
                        {selectedMessage.email}
                      </ContactItem>
                      {selectedMessage.phone && (
                        <ContactItem>
                          <Phone size={14} />
                          {selectedMessage.phone}
                        </ContactItem>
                      )}
                      <ContactItem>
                        <Calendar size={14} />
                        {new Date(selectedMessage.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </ContactItem>
                    </SenderContact>
                  </SenderDetails>
                </SenderInfo>
              </MessageDetailHeader>
              <MessageDetailBody>
                <MessageContent>{selectedMessage.message}</MessageContent>
              </MessageDetailBody>
              <MessageDetailFooter>
                <Button variant="primary" leftIcon={<Mail size={18} />}>
                  Reply via Email
                </Button>
                <Button variant="ghost" leftIcon={<Eye size={18} />} onClick={handleMarkUnread}>
                  Mark as Unread
                </Button>
                <Button variant="ghost" leftIcon={<Trash2 size={18} />} onClick={handleDelete} style={{ color: 'var(--color-accent-error)' }}>
                  Delete
                </Button>
              </MessageDetailFooter>
            </>
          ) : (
            <EmptyState>
              <EmptyIcon>
                <Mail size={32} />
              </EmptyIcon>
              <EmptyTitle>Select a message</EmptyTitle>
              <EmptyText>Choose a message from the list to view its details</EmptyText>
            </EmptyState>
          )}
        </MessageDetail>
      </MessagesContainer>
    </PageWrapper>
  );
};
