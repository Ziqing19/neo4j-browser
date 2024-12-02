/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import React, { memo, useEffect, useRef } from 'react'
import { connect } from 'react-redux'

import { ExportItem } from '../Frame/ExportButton'
import { FrameContainer } from './FrameContainer'
import { AnimationContainer, Padding, StyledStream } from './styled'
import { GlobalState } from 'shared/globalState'
import {
  Connection,
  getActiveConnectionData
} from 'shared/modules/connections/connectionsDuck'
import { Frame, FrameStack, getFrames } from 'shared/modules/frames/framesDuck'
import { getScrollToTop } from 'shared/modules/settings/settingsDuck'
import styled from 'styled-components'
import { Link } from 'project-root/src/browser/modules/DBMSInfo/styled'
import { executeCommand } from 'project-root/src/shared/modules/commands/commandsDuck'
import { withBus } from 'react-suber'

type StreamProps = {
  frames: FrameStack[]
  activeConnectionData: Connection | null
  shouldScrollToTop: boolean
  exec: (cmd: string) => void
}

export interface BaseFrameProps {
  frame: Frame
  activeConnectionData: Connection | null
  stack: Frame[]
  isFullscreen: boolean
  isCollapsed: boolean
  setExportItems: (exportItems: ExportItem[]) => void
}

function Stream(props: StreamProps): JSX.Element {
  const base = useRef<HTMLDivElement>(null)
  const lastFrameCount = useRef(0)

  useEffect(() => {
    // If we want to scroll to top when a new frame is added
    if (
      lastFrameCount.current < props.frames.length &&
      props.shouldScrollToTop &&
      base.current
    ) {
      base.current.scrollTop = 0
    }

    lastFrameCount.current = props.frames.length
  })

  return (
    <StyledStream ref={base} data-testid="stream">
      {props.frames.map((frameObject: FrameStack) => (
        <AnimationContainer key={frameObject.stack[0].id}>
          <FrameContainer
            frameData={frameObject}
            activeConnectionData={props.activeConnectionData}
          />
        </AnimationContainer>
      ))}
      {props.frames.length === 0 && (
        <CenteredPrompt>
          <div>
            <span style={{ marginRight: '10px' }}>查看本体模型请点击</span>
            <Link onClick={() => props.exec(':ont')}>:ont</Link>
          </div>
          <div>推荐栏集成在本体模型窗口中</div>
          <div>节点搜索请点击左侧操作指引栏</div>
        </CenteredPrompt>
      )}
      <Padding />
    </StyledStream>
  )
}

const CenteredPrompt = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
`

const mapStateToProps = (state: GlobalState) => ({
  frames: getFrames(state),
  activeConnectionData: getActiveConnectionData(state),
  shouldScrollToTop: getScrollToTop(state)
})

const mapDispatchToProps = (_dispatch: any, ownProps: any) => {
  return {
    exec: (cmd: string) => {
      const action = executeCommand(cmd)
      ownProps.bus.send(action.type, action)
    }
  }
}

export default withBus(
  connect(mapStateToProps, mapDispatchToProps)(memo(Stream))
)
