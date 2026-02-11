import type { FC } from 'react';

interface Props {
  isListening: boolean;
  isScreenShared: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onStartSharing: () => void;
  onStopSharing: () => void;
  onClearSession: () => void;
  onRunDemo: () => void;
}

export const ControlPanel: FC<Props> = ({
  isListening,
  isScreenShared,
  onStartListening,
  onStopListening,
  onStartSharing,
  onStopSharing,
  onClearSession,
  onRunDemo,
}) => (
  <section className="card">
    <h2>Controls</h2>
    <div className="control-grid">
      <button type="button" onClick={isListening ? onStopListening : onStartListening}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <button type="button" onClick={isScreenShared ? onStopSharing : onStartSharing}>
        {isScreenShared ? 'Stop Screen Share' : 'Share Screen'}
      </button>
      <button type="button" className="secondary" onClick={onClearSession}>
        Clear Session
      </button>
      <button type="button" className="secondary" onClick={onRunDemo}>
        Run Demo Scenario
      </button>
    </div>
    <p className="helper">Visible assistant only • user-initiated permissions • no auto typing</p>
  </section>
);
