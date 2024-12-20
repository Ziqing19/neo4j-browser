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
import React, { Component } from 'react'

import { Link, StyledKey, StyledTable, StyledValue } from './styled'
import {
  DrawerSection,
  DrawerSectionBody,
  DrawerSubHeader
} from 'browser-components/drawer/drawer-styled'

export class UserDetails extends Component<any> {
  render() {
    const userDetails = this.props.user
    const roles = userDetails && userDetails.roles ? userDetails.roles : []
    if (userDetails.username) {
      const mappedRoles = roles.length > 0 ? roles.join(', ') : '-'
      const hasAdminRole = roles
        .map((role: any) => role.toLowerCase())
        .includes('admin')
      return (
        <DrawerSection className="user-details">
          <DrawerSubHeader>用户信息</DrawerSubHeader>
          <DrawerSectionBody>
            <StyledTable>
              <tbody>
                <tr>
                  <StyledKey>用户名：</StyledKey>
                  <StyledValue data-testid="user-details-username">
                    {userDetails.username}
                  </StyledValue>
                </tr>
                <tr>
                  <StyledKey>角色：</StyledKey>
                  <StyledValue data-testid="user-details-roles">
                    {mappedRoles}
                  </StyledValue>
                </tr>
                {hasAdminRole && (
                  <>
                    <tr>
                      <StyledKey className="user-list-button">
                        管理员：
                      </StyledKey>
                      <StyledValue>
                        <Link
                          onClick={() =>
                            this.props.onItemClick(':server user list')
                          }
                        >
                          :server user list
                        </Link>
                      </StyledValue>
                    </tr>
                    <tr>
                      <StyledKey className="user-list-button" />
                      <StyledValue>
                        <Link
                          onClick={() =>
                            this.props.onItemClick(':server user add')
                          }
                        >
                          :server user add
                        </Link>
                      </StyledValue>
                    </tr>
                  </>
                )}
                <tr>
                  <StyledKey className="user-list-button">断开连接：</StyledKey>
                  <StyledValue>
                    <Link
                      onClick={() =>
                        this.props.onItemClick(':server disconnect')
                      }
                    >
                      :server disconnect
                    </Link>
                  </StyledValue>
                </tr>
              </tbody>
            </StyledTable>
          </DrawerSectionBody>
        </DrawerSection>
      )
    } else {
      return null
    }
  }
}
