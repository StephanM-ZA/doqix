import React from 'react';
import {Composition, Folder} from 'remotion';
import {BlueprintVideo, TOTAL_DURATION_FRAMES} from './BlueprintVideo';
import {WorkflowDemo, WORKFLOW_TOTAL_FRAMES} from './WorkflowDemo';
import {
  HeroWorkflow,
  HERO_TOTAL_FRAMES,
  HeroScene1Problem,
  HeroScene2Transform,
  HeroScene3Workflow,
  HeroScene4Result,
  SCENE1_FRAMES,
  SCENE2_FRAMES,
  SCENE3_FRAMES,
  SCENE4_FRAMES,
} from './HeroWorkflow';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BlueprintVideo"
        component={BlueprintVideo}
        durationInFrames={TOTAL_DURATION_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WorkflowDemo"
        component={WorkflowDemo}
        durationInFrames={WORKFLOW_TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Hero Workflow — full composition + individual scenes */}
      <Folder name="HeroWorkflow">
        <Composition
          id="HeroWorkflow-Full"
          component={HeroWorkflow}
          durationInFrames={HERO_TOTAL_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene1-Problem"
          component={HeroScene1Problem}
          durationInFrames={SCENE1_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene2-Transform"
          component={HeroScene2Transform}
          durationInFrames={SCENE2_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene3-Workflow"
          component={HeroScene3Workflow}
          durationInFrames={SCENE3_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene4-Result"
          component={HeroScene4Result}
          durationInFrames={SCENE4_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
