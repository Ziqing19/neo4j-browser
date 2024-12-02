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

import {
  AboutIcon,
  CloudSyncIcon,
  DatabaseIcon,
  DocumentsIcon,
  FavoritesIcon,
  GuideDrawerIcon,
  ProjectFilesIcon,
  SettingsIcon
} from 'browser-components/icons/LegacyIcons'

import DatabaseDrawer from '../DBMSInfo/DBMSInfo'
import BrowserSync from '../Sync/BrowserSync'
import AboutDrawer from './About'
import DocumentsDrawer from './Documents'
import GuideDrawer from './GuideDrawer'
import ProjectFilesDrawer from './ProjectFiles'
import UserSettingsDrawer from './UserSettings'
import Favorites from './favorites'
import StaticScripts from './static-scripts'
import TabNavigation, {
  NavItem,
  STANDARD_DRAWER_WIDTH
} from 'browser-components/TabNavigation/Navigation'
import { DrawerHeader } from 'browser-components/drawer/drawer-styled'
import { GlobalState } from 'shared/globalState'
import { isRelateAvailable } from 'shared/modules/app/appDuck'
import {
  CONNECTED_STATE,
  DISCONNECTED_STATE,
  PENDING_STATE
} from 'shared/modules/connections/connectionsDuck'
import { utilizeBrowserSync } from 'shared/modules/features/featuresDuck'
import { getCurrentDraft } from 'shared/modules/sidebar/sidebarDuck'
import { isUserSignedIn } from 'shared/modules/sync/syncDuck'
import MyGuideDrawer from 'project-root/src/browser/modules/Sidebar/MyGuideDrawer'

interface SidebarProps {
  selectedDrawerName: string
  onNavClick: () => void
  neo4jConnectionState: string
  showStaticScripts: boolean
  syncConnected: boolean
  loadSync: boolean
  isRelateAvailable: boolean
  scriptDraft: string | null
}

const Sidebar = ({
  selectedDrawerName,
  onNavClick,
  neo4jConnectionState,
  showStaticScripts,
  syncConnected,
  isRelateAvailable,
  scriptDraft
}: SidebarProps) => {
  const topNavItems: NavItem[] = [
    {
      name: 'Guides',
      title: '功能指引',
      icon: function GuideDrawerIconComp(isOpen: boolean): JSX.Element {
        return <GuideDrawerIcon isOpen={isOpen} />
      },
      content: MyGuideDrawer
    },
    {
      // Consider use constant variable to store those keys
      name: 'DBMS',
      title: '数据库信息',
      icon: function dbIcon(isOpen: boolean): JSX.Element {
        return (
          <DatabaseIcon
            isOpen={isOpen}
            connectionState={neo4jConnectionState}
            title="数据库信息"
          />
        )
      },
      content: DatabaseDrawer
    },
    {
      name: 'Favorites',
      title: '我的收藏',
      icon: function favIcon(isOpen: boolean): JSX.Element {
        return <FavoritesIcon isOpen={isOpen} title="我的收藏" />
      },
      content: function FavoritesDrawer(): JSX.Element {
        return (
          <div style={{ width: STANDARD_DRAWER_WIDTH }}>
            <DrawerHeader> Favorites </DrawerHeader>
            <Favorites />
            {showStaticScripts && <StaticScripts />}
          </div>
        )
      }
    },
    ...(isRelateAvailable
      ? [
          {
            name: 'Project Files',
            title: '项目文件',
            icon: function projectFilesIcon(isOpen: boolean): JSX.Element {
              return <ProjectFilesIcon isOpen={isOpen} title="项目文件" />
            },
            content: function ProjectDrawer(): JSX.Element {
              return <ProjectFilesDrawer scriptDraft={scriptDraft || ''} />
            }
          }
        ]
      : [])
  ].filter(({ name }) => ['Guides', 'DBMS'].includes(name))

  const bottomNavItems: NavItem[] = [
    {
      name: 'Documents',
      title: '帮助 &amp; 资源',
      icon: function docsIcon(isOpen: boolean): JSX.Element {
        return <DocumentsIcon isOpen={isOpen} title="帮助 &amp; 资源" />
      },
      content: DocumentsDrawer,
      enableCannyBadge: true
    },
    {
      name: 'Sync',
      title: '云同步',
      icon: function syncIcon(isOpen: boolean): JSX.Element {
        return (
          <CloudSyncIcon
            isOpen={isOpen}
            connected={syncConnected}
            title="云同步"
          />
        )
      },
      content: BrowserSync
    },
    {
      name: 'Settings',
      title: '设置',
      icon: function settingIcon(isOpen: boolean): JSX.Element {
        return <SettingsIcon isOpen={isOpen} title="设置" />
      },
      content: UserSettingsDrawer
    },
    {
      name: 'About',
      title: '关于本项目',
      icon: function aboutIcon(isOpen: boolean): JSX.Element {
        return <AboutIcon isOpen={isOpen} title="关于本项目" />
      },
      content: AboutDrawer
    }
  ].filter(({ name }) => ['Settings', 'About'].includes(name))

  return (
    <TabNavigation
      selectedDrawerName={selectedDrawerName}
      onNavClick={onNavClick}
      topNavItems={topNavItems}
      bottomNavItems={bottomNavItems}
    />
  )
}

const mapStateToProps = (state: GlobalState) => {
  let connectionState = 'disconnected'
  if (state.connections) {
    switch (state.connections.connectionState) {
      case PENDING_STATE:
        connectionState = 'pending'
        break
      case CONNECTED_STATE:
        connectionState = 'connected'
        break
      case DISCONNECTED_STATE:
        connectionState = 'disconnected'
        break
    }
  }
  return {
    syncConnected: isUserSignedIn(state) || false,
    neo4jConnectionState: connectionState,
    loadSync: utilizeBrowserSync(state),
    showStaticScripts: state.settings.showSampleScripts,
    isRelateAvailable: isRelateAvailable(state),
    scriptDraft: getCurrentDraft(state)
  }
}

export default connect(mapStateToProps)(Sidebar)
