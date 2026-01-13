import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Search, Mail, Phone, Calendar, Trash2, Eye, RefreshCw, Inbox } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { membershipService } from '../../services/membership.service';

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

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
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

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: var(--radius-sm);
  margin-left: 0.5rem;
  background: ${({ $status }) =>
    $status === 'new' ? 'var(--color-accent-success)' :
    $status === 'read' ? 'var(--color-neutral-200)' :
    'var(--color-neutral-100)'};
  color: ${({ $status }) =>
    $status === 'new' ? 'white' :
    $status === 'read' ? 'var(--color-neutral-600)' :
    'var(--color-neutral-500)'};
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

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-neutral-200);
  border-top-color: var(--color-primary-600);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  submittedAt: string;
}

export const MessagesManager = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Fetch messages from Firebase
  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const data = await membershipService.getContactSubmissions();
      setMessages(data as ContactMessage[]);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'new' && m.status === 'new') ||
      (filter === 'read' && m.status !== 'new');
    return matchesSearch && matchesFilter;
  });

  const newCount = messages.filter((m) => m.status === 'new').length;

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

  const handleSelectMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    // Mark as read locally (in a real app, you'd also update this in Firebase)
    if (message.status === 'new') {
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, status: 'read' as const } : m))
      );
    }
  };

  const handleMarkUnread = () => {
    if (selectedMessage) {
      setMessages((prev) =>
        prev.map((m) => (m.id === selectedMessage.id ? { ...m, status: 'new' as const } : m))
      );
      setSelectedMessage({ ...selectedMessage, status: 'new' });
    }
  };

  const handleDelete = () => {
    if (selectedMessage && window.confirm('Are you sure you want to delete this message?')) {
      setMessages((prev) => prev.filter((m) => m.id !== selectedMessage.id));
      setSelectedMessage(null);
    }
  };

  const handleReplyEmail = () => {
    if (selectedMessage) {
      window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`;
    }
  };

  return (
    <PageWrapper>
      <Header>
        <Title>Contact Messages {newCount > 0 && `(${newCount} new)`}</Title>
        <HeaderActions>
          <Button
            variant="ghost"
            leftIcon={<RefreshCw size={18} />}
            onClick={fetchMessages}
          >
            Refresh
          </Button>
          <SearchBox>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBox>
        </HeaderActions>
      </Header>

      <FilterTabs>
        <FilterTab $active={filter === 'all'} onClick={() => setFilter('all')}>
          All Messages
        </FilterTab>
        <FilterTab $active={filter === 'new'} onClick={() => setFilter('new')}>
          New ({newCount})
        </FilterTab>
        <FilterTab $active={filter === 'read'} onClick={() => setFilter('read')}>
          Read
        </FilterTab>
      </FilterTabs>

      {isLoading ? (
        <LoadingState>
          <Spinner />
        </LoadingState>
      ) : (
        <MessagesContainer>
          <MessagesList>
            {filteredMessages.length === 0 ? (
              <EmptyState>
                <EmptyIcon>
                  <Inbox size={32} />
                </EmptyIcon>
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
                  $unread={message.status === 'new'}
                  onClick={() => handleSelectMessage(message)}
                >
                  <MessageHeader>
                    <MessageSender $unread={message.status === 'new'}>
                      {message.status === 'new' && <UnreadDot />}
                      {message.name}
                    </MessageSender>
                    <MessageTime>{formatDate(message.submittedAt)}</MessageTime>
                  </MessageHeader>
                  <MessageSubject $unread={message.status === 'new'}>
                    {message.subject}
                    <StatusBadge $status={message.status}>
                      {message.status}
                    </StatusBadge>
                  </MessageSubject>
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
                      {selectedMessage.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
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
                          {new Date(selectedMessage.submittedAt).toLocaleDateString('en-US', {
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
                  <Button variant="primary" leftIcon={<Mail size={18} />} onClick={handleReplyEmail}>
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
      )}
    </PageWrapper>
  );
};
