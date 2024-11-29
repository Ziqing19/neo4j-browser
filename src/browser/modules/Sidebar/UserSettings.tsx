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

import { toKeyString } from 'neo4j-arc/common'

import {
  StyledSetting,
  StyledSettingLabel,
  StyledSettingTextInput
} from './styled'
import { CheckboxSelector, RadioSelector } from 'browser-components/Form'
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerSection,
  DrawerSectionBody,
  DrawerSubHeader
} from 'browser-components/drawer/drawer-styled'
import FeatureToggle from 'browser/modules/FeatureToggle/FeatureToggle'
import { GlobalState } from 'shared/globalState'
import {
  disableExperimentalFeature,
  enableExperimentalFeature,
  experimentalFeatureSelfName,
  getExperimentalFeatures
} from 'shared/modules/experimentalFeatures/experimentalFeaturesDuck'
import * as actions from 'shared/modules/settings/settingsDuck'
import {
  TelemetrySettingSource,
  TelemetrySettings,
  getTelemetrySettings
} from 'shared/utils/selectors'

const visualSettings = [
  {
    title: '用户界面',
    settings: [
      {
        theme: {
          tooltip: '使用“自动”让浏览器检测系统深色与浅色模式（如果可用）。',
          displayName: '主题',
          type: 'radio',
          options: [
            actions.AUTO_THEME,
            actions.LIGHT_THEME,
            actions.OUTLINE_THEME,
            actions.DARK_THEME
          ],
          i18n: {
            auto: '自动',
            normal: '普通',
            outline: '边框',
            dark: '黑暗'
          }
        }
      },
      {
        codeFontLigatures: {
          displayName: '代码字体连字',
          tooltip: '在命令栏和cypher片段中使用字体连字',
          type: 'checkbox'
        }
      },
      {
        enableMultiStatementMode: {
          displayName: '启用多语句查询编辑器',
          tooltip: '允许查询编辑器执行多个语句',
          type: 'checkbox'
        }
      }
    ]
  },
  {
    title: '偏好设置',
    settings: [
      {
        initCmd: {
          displayName: '初始执行命令',
          tooltip: '一旦连接到图形数据库，就执行这些命令。',
          type: 'input'
        }
      },
      {
        connectionTimeout: {
          displayName: '连接超时（毫秒）',
          tooltip: '建立连接到Neo4j时的超时时间（毫秒）。',
          type: 'input'
        }
      },
      {
        useReadTransactions: {
          displayName: '对cypher查询使用读取事务。',
          tooltip:
            '此设置在集群环境中很有用，如果你想确保读取查询被发送到次要节点。',
          type: 'checkbox'
        }
      }
    ]
  },
  {
    title: '结果框架',
    settings: [
      {
        maxFrames: {
          displayName: '最大结果框架数',
          tooltip: '达到最大结果框架数时，旧框架将被替换。'
        }
      },
      {
        maxHistory: {
          displayName: '最大历史长度',
          tooltip: '达到最大历史条目数时，旧条目将被替换。'
        }
      },
      {
        scrollToTop: {
          displayName: '添加框架时滚动到顶部',
          tooltip: '在新框架上自动滚动流到顶部。',
          type: 'checkbox'
        }
      }
    ]
  },
  {
    title: '图形可视化',
    settings: [
      {
        initialNodeDisplay: {
          displayName: '初始节点显示',
          tooltip: '限制在图形可视化首次加载时显示的节点数量。'
        }
      },
      {
        maxNeighbours: {
          displayName: '最大邻居数',
          tooltip: '限制探索性查询到此限制。'
        }
      },
      {
        maxRows: {
          displayName: '结果视图最大行数',
          tooltip: "在'行'结果视图中渲染的最大行数"
        }
      },
      {
        maxFieldItems: {
          displayName: '最大记录字段数',
          tooltip: '限制每个返回记录的字段数'
        }
      },
      {
        autoComplete: {
          displayName: '连接结果节点',
          tooltip:
            '如果选中，在检索到cypher查询结果后，将执行第二个查询以获取结果节点之间的关系。',
          type: 'checkbox'
        }
      },
      {
        showWheelZoomInfo: {
          displayName: '显示缩放交互提示',
          tooltip: '弹出信息块，显示滚动交互的按键绑定。',
          type: 'checkbox'
        }
      }
    ]
  }
]

function getTelemetryVisualSetting({
  telemetrySettings,
  trackOptOutCrashReports,
  trackOptOutUserStats
}: {
  telemetrySettings: TelemetrySettings
  trackOptOutCrashReports: (optedIn: boolean) => void
  trackOptOutUserStats: (optedIn: boolean) => void
}) {
  const settingsByFactor: Record<TelemetrySettingSource, any> = {
    SETTINGS_NOT_LOADED: [
      {
        allowUserStats: {
          displayName: '产品使用情况',
          tooltip: '在数据库连接完全建立之前，产品使用分析被禁用。',
          type: 'info'
        }
      }
    ],
    DESKTOP_SETTING: [
      {
        allowUserStats: {
          displayName: '产品分析',
          tooltip: `产品使用统计${telemetrySettings.allowUserStats ? '已发送' : '未发送'}，崩溃报告${telemetrySettings.allowCrashReporting ? '已发送' : '未发送'}。这些设置可以在桌面端更改。`,
          type: 'info'
        }
      }
    ],
    NEO4J_CONF: [
      {
        allowUserStats: {
          displayName: '产品使用情况',
          tooltip: `您的数据库被${telemetrySettings.allowUserStats ? '' : '未'}配置为在neo4j.conf中发送产品分析数据。`,
          type: 'info'
        }
      }
    ],
    AURA: [
      {
        allowUserStats: {
          displayName: '产品使用情况',
          tooltip: `Aura控制台已配置您的数据库${telemetrySettings.allowUserStats ? '' : '未'}发送产品分析数据。`,
          type: 'info'
        }
      }
    ],
    BROWSER_SETTING: [
      {
        allowCrashReports: {
          displayName: '发送匿名崩溃报告',
          tooltip:
            '崩溃报告使我们能够快速诊断和修复问题。不会收集或发送任何个人信息。',
          type: 'checkbox',
          onChange: trackOptOutCrashReports
        }
      },
      {
        allowUserStats: {
          displayName: '发送匿名使用统计',
          tooltip:
            '这些数据帮助我们确定功能和改进的优先级。不会收集或发送任何个人信息。',
          type: 'checkbox',
          onChange: trackOptOutUserStats
        }
      }
    ]
  }

  const title = '产品分析'
  const settings = settingsByFactor[telemetrySettings.source]
  return { title, settings }
}

export const UserSettings = ({
  settings,
  visualSettings,
  experimentalFeatures = {},
  onSettingsSave = () => {},
  onFeatureChange,
  telemetrySettings,
  trackOptOutCrashReports,
  trackOptOutUserStats
}: any) => {
  if (!settings) return null

  const mappedSettings = visualSettings
    .concat([
      getTelemetryVisualSetting({
        telemetrySettings,
        trackOptOutCrashReports,
        trackOptOutUserStats
      })
    ])
    .map((visualSetting: any) => {
      const title = <DrawerSubHeader>{visualSetting.title}</DrawerSubHeader>
      const mapSettings = visualSetting.settings
        .map((settingObj: any) => {
          const setting = Object.keys(settingObj)[0]
          if (typeof settings[setting] === 'undefined') return null
          const visual = settingObj[setting].displayName
          const tooltip = settingObj[setting].tooltip || ''
          const type = settingObj[setting].type || 'input'
          const onSettingChange = settingObj[setting].onChange

          if (type === 'input') {
            return (
              <StyledSetting key={toKeyString(visual)}>
                <StyledSettingLabel title={tooltip}>
                  {visual}
                  <StyledSettingTextInput
                    onChange={(event: any) => {
                      const newValue = event.target.value
                      settings[setting] = newValue
                      onSettingChange && onSettingChange(newValue)
                      onSettingsSave(settings)
                    }}
                    defaultValue={settings[setting]}
                    title={tooltip}
                    className={setting}
                    data-testid={`setting-${setting}`}
                  />
                </StyledSettingLabel>
              </StyledSetting>
            )
          }

          if (type === 'radio') {
            return (
              <StyledSetting key={toKeyString(visual)}>
                <StyledSettingLabel title={tooltip}>
                  {visual}
                </StyledSettingLabel>
                <RadioSelector
                  options={settingObj[setting].options}
                  labels={settingObj[setting].i18n}
                  onChange={(event: any) => {
                    const newValue = event.target.value
                    settings[setting] = newValue
                    onSettingChange && onSettingChange(newValue)
                    onSettingsSave(settings)
                  }}
                  selectedValue={settings[setting]}
                  data-testid={`setting-${setting}`}
                />
              </StyledSetting>
            )
          }

          if (type === 'checkbox') {
            return (
              <StyledSetting key={toKeyString(visual)}>
                <StyledSettingLabel title={tooltip}>
                  <CheckboxSelector
                    onChange={(event: any) => {
                      const newValue = event.target.checked
                      settings[setting] = newValue
                      onSettingChange && onSettingChange(newValue)
                      onSettingsSave(settings)
                    }}
                    checked={settings[setting]}
                    data-testid={`setting-${setting}`}
                  />
                  {visual}
                </StyledSettingLabel>
              </StyledSetting>
            )
          }

          if (type === 'info') {
            return (
              <StyledSetting key={toKeyString(visual)}>{tooltip}</StyledSetting>
            )
          }
          return null
        })
        .filter((setting: any) => setting !== null)

      return (
        <React.Fragment key={toKeyString(visualSetting.title)}>
          {title}
          {mapSettings}
        </React.Fragment>
      )
    })

  const mappedExperimentalFeatures = Object.keys(experimentalFeatures)
    .map(key => {
      const feature = experimentalFeatures[key]
      // Don't show the toggle to disable this section
      if (feature.name === experimentalFeatureSelfName) {
        return null
      }
      const visual = feature.displayName
      const tooltip = feature.tooltip || ''
      return (
        <StyledSetting key={toKeyString(feature.name)}>
          <StyledSettingLabel title={tooltip}>
            <CheckboxSelector
              onChange={(event: any) => {
                const on = event.target.checked
                onFeatureChange(feature.name, on)
              }}
              checked={experimentalFeatures[feature.name].on}
            />
            {visual}
          </StyledSettingLabel>
        </StyledSetting>
      )
    })
    .filter(r => r)

  return (
    <Drawer id="db-settings">
      <DrawerHeader>浏览设置</DrawerHeader>
      <DrawerBody>
        <DrawerSection>
          <DrawerSectionBody key="settings">{mappedSettings}</DrawerSectionBody>
          <FeatureToggle
            name={experimentalFeatureSelfName}
            on={
              <>
                {mappedExperimentalFeatures.length ? (
                  <DrawerSubHeader>Experimental features</DrawerSubHeader>
                ) : null}
                <DrawerSectionBody key="experimental-features">
                  {mappedExperimentalFeatures}
                </DrawerSectionBody>
              </>
            }
          />
        </DrawerSection>
      </DrawerBody>
    </Drawer>
  )
}

const mapStateToProps = (state: GlobalState) => {
  return {
    experimentalFeatures: getExperimentalFeatures(state),
    settings: state.settings,
    visualSettings,
    telemetrySettings: getTelemetrySettings(state)
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onSettingsSave: (settings: Partial<actions.SettingsState>) => {
      dispatch(actions.update(settings))
    },
    trackOptOutCrashReports(optedIn: boolean) {
      if (!optedIn) {
        dispatch({ type: actions.TRACK_OPT_OUT_CRASH_REPORTS })
      }
    },
    trackOptOutUserStats: (optedIn: boolean) => {
      if (!optedIn) {
        dispatch({ type: actions.TRACK_OPT_OUT_USER_STATS })
      }
    },
    onFeatureChange: (name: any, on: any) => {
      if (on) {
        dispatch(enableExperimentalFeature(name))
      } else {
        dispatch(disableExperimentalFeature(name))
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings)
