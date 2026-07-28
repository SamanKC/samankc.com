'use client';

import { useState } from 'react';
import TokenGate from './TokenGate';
import PostList from './PostList';
import PostEditor from './PostEditor';

type View = { name: 'list' } | { name: 'editor'; filename: string | null };

export default function AdminClient() {
  const [view, setView] = useState<View>({ name: 'list' });

  return (
    <TokenGate>
      {(token, onInvalidToken) =>
        view.name === 'list' ? (
          <PostList
            token={token}
            onInvalidToken={onInvalidToken}
            onNew={() => setView({ name: 'editor', filename: null })}
            onEdit={(filename) => setView({ name: 'editor', filename })}
          />
        ) : (
          <PostEditor
            token={token}
            filename={view.filename}
            onDone={() => setView({ name: 'list' })}
            onInvalidToken={onInvalidToken}
          />
        )
      }
    </TokenGate>
  );
}
