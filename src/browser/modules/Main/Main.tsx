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
import React, { useEffect } from 'react'

import Editor from '../Editor/MainEditor'
import Stream from '../Stream/Stream'
import AutoExecButton from '../Stream/auto-exec-button'
import { useSlowConnectionState } from './main.hooks'
import {
  DismissBanner,
  ErrorBanner,
  NotAuthedBanner,
  StyledMain,
  UdcConsentBanner,
  UnderlineClickable,
  WarningBanner
} from './styled'
import ErrorBoundary from 'browser-components/ErrorBoundary'
import {
  CONNECTING_STATE,
  DISCONNECTED_STATE,
  PENDING_STATE
} from 'shared/modules/connections/connectionsDuck'
import { TrialStatus } from 'shared/modules/dbMeta/dbMetaDuck'

type MainProps = {
  connectionState: number
  isDatabaseUnavailable: boolean
  errorMessage?: string
  lastConnectionUpdate: number
  showUdcConsentBanner: boolean
  useDb: string | null
  dismissConsentBanner: () => void
  incrementConsentBannerShownCount: () => void
  openSettingsDrawer: () => void
  trialStatus: TrialStatus
}

const Main = React.memo(function Main(props: MainProps) {
  const [past5Sec, past10Sec] = useSlowConnectionState(props)
  const [showRemainingTrialBanner, setShowRemainingTrialBanner] =
    React.useState(true)
  const {
    connectionState,
    isDatabaseUnavailable,
    errorMessage,
    showUdcConsentBanner,
    useDb,
    dismissConsentBanner,
    incrementConsentBannerShownCount,
    openSettingsDrawer,
    trialStatus
  } = props

  useEffect(() => {
    showUdcConsentBanner && incrementConsentBannerShownCount()
  }, [
    showUdcConsentBanner /* missing function from dep array but including it causes loop */
  ])

  return (
    <StyledMain data-testid="main">
      <ErrorBoundary>
        <Editor />
      </ErrorBoundary>
      {showUdcConsentBanner && (
        <UdcConsentBanner>
          <span>
            为了帮助改进Neo4j浏览器，我们收集产品使用信息。您可以随时查看您的
            <UnderlineClickable onClick={openSettingsDrawer}>
              设置
            </UnderlineClickable>
            。
          </span>
          <DismissBanner onClick={dismissConsentBanner} />
        </UdcConsentBanner>
      )}
      {useDb && isDatabaseUnavailable && (
        <ErrorBanner>
          {`数据库 '${useDb}' 不可用，运行`}
          <AutoExecButton cmd="sysinfo" />
          获取更多信息
        </ErrorBanner>
      )}
      {errorMessage && (
        <ErrorBanner data-testid="errorBanner">{errorMessage}</ErrorBanner>
      )}
      {connectionState === DISCONNECTED_STATE && (
        <NotAuthedBanner data-testid="disconnectedBanner">
          尚未连接到数据库
        </NotAuthedBanner>
      )}
      {connectionState === PENDING_STATE && !past10Sec && (
        <WarningBanner data-testid="reconnectBanner">
          与服务器的连接断开。正在重新连接...
        </WarningBanner>
      )}
      {connectionState === CONNECTING_STATE && past5Sec && !past10Sec && (
        <NotAuthedBanner>仍在连接中...</NotAuthedBanner>
      )}
      {past10Sec && <WarningBanner>服务器响应时间过长...</WarningBanner>}

      {trialStatus.status === 'expired' && (
        <ErrorBanner style={{ overflow: 'auto' }}>
          感谢您安装Neo4j。这是一个有时间限制的试用版，
          {trialStatus.totalDays}
          天的试用期已过期。请访问
          <a href="https://neo4j.com/contact-us/">
            https://neo4j.com/contact-us/
          </a>
          以继续使用该软件。 未经Neo4j,
          Inc.或其关联公司适当的商业或评估许可证使用此软件是被禁止的。
        </ErrorBanner>
      )}
      {trialStatus.status === 'eval' && showRemainingTrialBanner && (
        <WarningBanner style={{ overflow: 'auto' }}>
          感谢您安装Neo4j。这是一个有时间限制的试用版。您还有
          {trialStatus.daysRemaining}天的试用期，总共
          {trialStatus.totalDays}
          天。如果您需要更多时间，请通过以下链接联系我们：
          <a href="https://neo4j.com/contact-us/">
            https://neo4j.com/contact-us/
          </a>
          <div
            style={{
              position: 'absolute',
              right: 20,
              display: 'inline-block'
            }}
          >
            <DismissBanner onClick={() => setShowRemainingTrialBanner(false)} />
          </div>
        </WarningBanner>
      )}

      {trialStatus.status === 'unaccepted' && showRemainingTrialBanner && (
        <WarningBanner style={{ overflow: 'auto' }}>
          Neo4j许可证尚未被接受。要接受商业许可协议，请运行neo4j-admin server
          license --accept-commercial。 要接受评估协议的条款，请运行neo4j-admin
          server license --accept-evaluation。(C) Neo4j Sweden AB。版权所有。
          未经Neo4j,
          Inc.或其关联公司适当的商业许可证或评估许可证使用此软件是被禁止的。
          如果您不遵守规定，Neo4j有权终止您的使用权。如需了解有关许可证的信息，请通过以下链接联系我们：
          <a href="https://neo4j.com/contact-us/">
            https://neo4j.com/contact-us/
          </a>
          .
          <div
            style={{
              position: 'absolute',
              right: 20,
              display: 'inline-block'
            }}
          >
            <DismissBanner onClick={() => setShowRemainingTrialBanner(false)} />
          </div>
        </WarningBanner>
      )}

      <ErrorBoundary>
        <Stream />
      </ErrorBoundary>
    </StyledMain>
  )
})

export default Main
