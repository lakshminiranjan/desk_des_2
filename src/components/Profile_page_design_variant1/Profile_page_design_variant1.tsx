import { memo } from 'react';
import type { FC } from 'react';

import resets from '../_resets.module.scss';
import { Location_iconIcon } from './Location_iconIcon.js';
import { Mobile_iconIcon } from './Mobile_iconIcon.js';
import { Mobile_numberIcon } from './Mobile_numberIcon.js';
import classes from './Profile_page_design_variant1.module.scss';

interface Props {
  className?: string;
}
/* @figmaId 167:334 */
export const Profile_page_design_variant1: FC<Props> = memo(function Profile_page_design_variant1(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={classes.profile_container_1}>
        <div className={classes.profile_container_1__profile_details_container}>
          <div className={classes.profile_container_1__profile_details_container__image}></div>
          <div className={classes.profile_container_1__profile_details_container__frame6}>
            <div className={classes.profile_container_1__profile_details_container__frame6__name}>Jonny Den</div>
            <div className={classes.profile_container_1__profile_details_container__frame6__role}>
              Software developer
            </div>
            <div className={classes.profile_container_1__profile_details_container__frame6__description}>
              Aliquip eu do est nulla consectetur sint ipsum nostrud eiusmod minim. Voluptate dolore commodo adipisicing
              exercitation irure sunt adipisicing eiusmod proident ea mollit Lorem et laborum velit. Aliquip qui ea
              nostrud ipsum quis sint magna voluptate anim laborum dolore tempor ullamco ut. Veniam qui non sint velit
              eiusmod irure do adipisicing sit.{' '}
            </div>
            <div className={classes.profile_container_1__profile_details_container__frame6__textboxEmail}>
              <div
                className={classes.profile_container_1__profile_details_container__frame6__textboxEmail__mobile_Number}
              >
                <Mobile_numberIcon
                  className={
                    classes.profile_container_1__profile_details_container__frame6__textboxEmail__mobile_Number__icon
                  }
                />
              </div>
              <div className={classes.profile_container_1__profile_details_container__frame6__textboxEmail__email}>
                johndoe@gmail.com
              </div>
            </div>
            <div className={classes.profile_container_1__profile_details_container__frame6__textboxMobile}>
              <div
                className={classes.profile_container_1__profile_details_container__frame6__textboxMobile__mobile_Icon}
              >
                <Mobile_iconIcon
                  className={
                    classes.profile_container_1__profile_details_container__frame6__textboxMobile__mobile_Icon__icon2
                  }
                />
              </div>
              <div
                className={
                  classes.profile_container_1__profile_details_container__frame6__textboxMobile__mobile_Number2
                }
              >
                99999XXXXX{' '}
              </div>
            </div>
            <div className={classes.profile_container_1__profile_details_container__frame6__textboxLocation}>
              <div
                className={
                  classes.profile_container_1__profile_details_container__frame6__textboxLocation__location_Icon
                }
              >
                <Location_iconIcon
                  className={
                    classes.profile_container_1__profile_details_container__frame6__textboxLocation__location_Icon__icon3
                  }
                />
              </div>
              <div className={classes.profile_container_1__profile_details_container__frame6__textboxLocation__address}>
                76-6,Houston street
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
