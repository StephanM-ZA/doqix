import React from 'react';
import {loadFont as loadMontserrat} from '@remotion/google-fonts/Montserrat';
import {loadFont as loadOpenSans} from '@remotion/google-fonts/OpenSans';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';

import {FPS, TRANSITION_DURATION_FRAMES} from './theme';
import {WorkflowHook} from './scenes/WorkflowHook';
import {WorkflowInvoice} from './scenes/WorkflowInvoice';
import {WorkflowLeads} from './scenes/WorkflowLeads';
import {WorkflowBigPicture} from './scenes/WorkflowBigPicture';

// Load fonts
loadMontserrat('normal', {weights: ['400', '600', '700'], subsets: ['latin']});
loadOpenSans('normal', {weights: ['400', '600'], subsets: ['latin']});

// Scene durations in seconds
const WORKFLOW_SCENES = [
  {Component: WorkflowHook, duration: 12},
  {Component: WorkflowInvoice, duration: 16},
  {Component: WorkflowLeads, duration: 16},
  {Component: WorkflowBigPicture, duration: 16},
];

export const WorkflowDemo: React.FC = () => {
  return (
    <TransitionSeries>
      {WORKFLOW_SCENES.map(({Component, duration}, index) => (
        <React.Fragment key={index}>
          <TransitionSeries.Sequence durationInFrames={duration * FPS}>
            <Component />
          </TransitionSeries.Sequence>
          {index < WORKFLOW_SCENES.length - 1 && (
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({
                durationInFrames: TRANSITION_DURATION_FRAMES,
              })}
            />
          )}
        </React.Fragment>
      ))}
    </TransitionSeries>
  );
};

export const WORKFLOW_TOTAL_FRAMES =
  WORKFLOW_SCENES.reduce((sum, s) => sum + s.duration * FPS, 0) -
  TRANSITION_DURATION_FRAMES * (WORKFLOW_SCENES.length - 1);
