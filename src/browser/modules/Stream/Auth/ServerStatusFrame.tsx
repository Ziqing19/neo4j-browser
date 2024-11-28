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
import React from 'react'
import { connect } from 'react-redux'

import FrameBodyTemplate from '../../Frame/FrameBodyTemplate'
import ConnectedView from './ConnectedView'
import {
  StyledConnectionAside,
  StyledConnectionBody,
  StyledConnectionBodyContainer
} from './styled'
import { H3 } from 'browser-components/headers'
import { ClickToCode } from 'browser/modules/ClickToCode/index'
import {
  getActiveConnection,
  getActiveConnectionData,
  isConnected
} from 'shared/modules/connections/connectionsDuck'
import { shouldRetainConnectionCredentials } from 'shared/modules/dbMeta/dbMetaDuck'

export const ServerStatusFrame = (props: any) => {
  const { activeConnectionData, storeCredentials, isConnected } = props

  return (
    <>
      <StyledConnectionAside>
        <span>
          <H3>连接情况</H3>
          这是您的连接信息
        </span>
      </StyledConnectionAside>
      <StyledConnectionBodyContainer>
        {(!isConnected || !activeConnectionData) && (
          <StyledConnectionBody>您还未连接到数据库</StyledConnectionBody>
        )}
        {isConnected &&
          activeConnectionData &&
          activeConnectionData.authEnabled && (
            <ConnectedView
              username={activeConnectionData && activeConnectionData.username}
              showHost
              host={activeConnectionData && activeConnectionData.host}
              storeCredentials={storeCredentials}
            />
          )}
        {isConnected &&
          activeConnectionData &&
          !activeConnectionData.authEnabled && (
            <StyledConnectionBody>
              您有一个正在进行中的连接，并且服务器验证已禁用
            </StyledConnectionBody>
          )}
      </StyledConnectionBodyContainer>
    </>
  )
}

const Frame = (props: any) => {
  return (
    <FrameBodyTemplate
      isCollapsed={props.isCollapsed}
      isFullscreen={props.isFullscreen}
      contents={<ServerStatusFrame {...props} />}
    />
  )
}

const mapStateToProps = (state: any) => {
  return {
    activeConnection: getActiveConnection(state),
    activeConnectionData: getActiveConnectionData(state),
    storeCredentials: shouldRetainConnectionCredentials(state),
    isConnected: isConnected(state)
  }
}

export default connect(mapStateToProps, null)(Frame)
