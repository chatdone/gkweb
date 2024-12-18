export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: any;
  /** The `Byte` scalar type represents byte value as a Buffer */
  Byte: any;
  /** A field whose value is a Currency: https://en.wikipedia.org/wiki/ISO_4217. */
  Currency: any;
  /**
   * A date string, such as 2007-12-03, compliant with the `full-date` format
   * outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for
   * representation of dates and times using the Gregorian calendar.
   */
  Date: any;
  /**
   * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the
   * `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO
   * 8601 standard for representation of dates and times using the Gregorian calendar.
   */
  DateTime: any;
  /**
   * A string representing a duration conforming to the ISO8601 standard,
   * such as: P1W1DT13H23M34S
   * P is the duration designator (for period) placed at the start of the duration representation.
   * Y is the year designator that follows the value for the number of years.
   * M is the month designator that follows the value for the number of months.
   * W is the week designator that follows the value for the number of weeks.
   * D is the day designator that follows the value for the number of days.
   * T is the time designator that precedes the time components of the representation.
   * H is the hour designator that follows the value for the number of hours.
   * M is the minute designator that follows the value for the number of minutes.
   * S is the second designator that follows the value for the number of seconds.
   *
   * Note the time designator, T, that precedes the time value.
   *
   * Matches moment.js, Luxon and DateFns implementations
   * ,/. is valid for decimal places and +/- is a valid prefix
   */
  Duration: any;
  /**
   * A field whose value conforms to the standard internet email address format as
   * specified in RFC822: https://www.w3.org/Protocols/rfc822/.
   */
  EmailAddress: any;
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  GUID: any;
  /** A field whose value is a CSS HSL color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl()_and_hsla(). */
  HSL: any;
  /** A field whose value is a CSS HSLA color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl()_and_hsla(). */
  HSLA: any;
  /** A field whose value is a hex color code: https://en.wikipedia.org/wiki/Web_colors. */
  HexColorCode: any;
  /** A field whose value is a hexadecimal: https://en.wikipedia.org/wiki/Hexadecimal. */
  Hexadecimal: any;
  /**
   * A field whose value is an International Bank Account Number (IBAN):
   * https://en.wikipedia.org/wiki/International_Bank_Account_Number.
   */
  IBAN: any;
  /** A field whose value is a IPv4 address: https://en.wikipedia.org/wiki/IPv4. */
  IPv4: any;
  /** A field whose value is a IPv6 address: https://en.wikipedia.org/wiki/IPv6. */
  IPv6: any;
  /** A field whose value is a ISBN-10 or ISBN-13 number: https://en.wikipedia.org/wiki/International_Standard_Book_Number. */
  ISBN: any;
  /**
   * A string representing a duration conforming to the ISO8601 standard,
   * such as: P1W1DT13H23M34S
   * P is the duration designator (for period) placed at the start of the duration representation.
   * Y is the year designator that follows the value for the number of years.
   * M is the month designator that follows the value for the number of months.
   * W is the week designator that follows the value for the number of weeks.
   * D is the day designator that follows the value for the number of days.
   * T is the time designator that precedes the time components of the representation.
   * H is the hour designator that follows the value for the number of hours.
   * M is the minute designator that follows the value for the number of minutes.
   * S is the second designator that follows the value for the number of seconds.
   *
   * Note the time designator, T, that precedes the time value.
   *
   * Matches moment.js, Luxon and DateFns implementations
   * ,/. is valid for decimal places and +/- is a valid prefix
   */
  ISO8601Duration: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
  /** A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction. */
  JWT: any;
  /** A field whose value is a valid decimal degrees latitude number (53.471): https://en.wikipedia.org/wiki/Latitude */
  Latitude: any;
  /** A local date string (i.e., with no associated timezone) in `YYYY-MM-DD` format, e.g. `2020-01-01`. */
  LocalDate: any;
  /**
   * A local time string (i.e., with no associated timezone) in 24-hr
   * `HH:mm[:ss[.SSS]]` format, e.g. `14:25` or `14:25:06` or `14:25:06.123`.  This
   * scalar is very similar to the `LocalTime`, with the only difference being that
   * `LocalEndTime` also allows `24:00` as a valid value to indicate midnight of the
   * following day.  This is useful when using the scalar to represent the exclusive
   * upper bound of a time block.
   */
  LocalEndTime: any;
  /**
   * A local time string (i.e., with no associated timezone) in 24-hr
   * `HH:mm[:ss[.SSS]]` format, e.g. `14:25` or `14:25:06` or `14:25:06.123`.
   */
  LocalTime: any;
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  Long: any;
  /** A field whose value is a valid decimal degrees longitude number (53.471): https://en.wikipedia.org/wiki/Longitude */
  Longitude: any;
  /** A field whose value is a IEEE 802 48-bit MAC address: https://en.wikipedia.org/wiki/MAC_address. */
  MAC: any;
  /** Floats that will have a value less than 0. */
  NegativeFloat: any;
  /** Integers that will have a value less than 0. */
  NegativeInt: any;
  /** A string that cannot be passed as an empty value */
  NonEmptyString: any;
  /** Floats that will have a value of 0 or more. */
  NonNegativeFloat: any;
  /** Integers that will have a value of 0 or more. */
  NonNegativeInt: any;
  /** Floats that will have a value of 0 or less. */
  NonPositiveFloat: any;
  /** Integers that will have a value of 0 or less. */
  NonPositiveInt: any;
  /**
   * A field whose value conforms with the standard mongodb object ID as described
   * here: https://docs.mongodb.com/manual/reference/method/ObjectId/#ObjectId.
   * Example: 5e5677d71bdc2ae76344968c
   */
  ObjectID: any;
  /**
   * A field whose value conforms to the standard E.164 format as specified in:
   * https://en.wikipedia.org/wiki/E.164. Basically this is +17895551234.
   */
  PhoneNumber: any;
  /**
   * A field whose value is a valid TCP port within the range of 0 to 65535:
   * https://en.wikipedia.org/wiki/Transmission_Control_Protocol#TCP_ports
   */
  Port: any;
  /** Floats that will have a value greater than 0. */
  PositiveFloat: any;
  /** Integers that will have a value greater than 0. */
  PositiveInt: any;
  /**
   * A field whose value conforms to the standard postal code formats for United
   * States, United Kingdom, Germany, Canada, France, Italy, Australia, Netherlands,
   * Spain, Denmark, Sweden, Belgium, India, Austria, Portugal, Switzerland or Luxembourg.
   */
  PostalCode: any;
  /** A field whose value is a CSS RGB color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba(). */
  RGB: any;
  /** A field whose value is a CSS RGBA color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba(). */
  RGBA: any;
  /**
   * The `SafeInt` scalar type represents non-fractional signed whole numeric values
   * that are considered safe as defined by the ECMAScript specification.
   */
  SafeInt: any;
  /**
   * A time string at UTC, such as 10:15:30Z, compliant with the `full-time` format
   * outlined in section 5.6 of the RFC 3339profile of the ISO 8601 standard for
   * representation of dates and times using the Gregorian calendar.
   */
  Time: any;
  /** The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: any;
  /** A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt. */
  URL: any;
  /** A currency string, such as $21.25 */
  USCurrency: any;
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  UUID: any;
  /** Floats that will have a value of 0 or more. */
  UnsignedFloat: any;
  /** Integers that will have a value of 0 or more. */
  UnsignedInt: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
  /** A field whose value is a UTC Offset: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones */
  UtcOffset: any;
  /** Represents NULL values */
  Void: any;
};

export type ActivityDaySummary = {
  __typename?: 'ActivityDaySummary';
  company_member?: Maybe<CompanyMember>;
  day?: Maybe<Scalars['Int']>;
  month?: Maybe<Scalars['Int']>;
  task?: Maybe<Task>;
  total?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
};

/** Not directly from the db, it is a combination all the week numbers sent */
export type ActivityMonthSummary = {
  __typename?: 'ActivityMonthSummary';
  company_member?: Maybe<CompanyMember>;
  task?: Maybe<Task>;
  total?: Maybe<Scalars['Int']>;
  week_number?: Maybe<Scalars['Int']>;
  week_total?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
};

export type ActivityWeekSummary = {
  __typename?: 'ActivityWeekSummary';
  company_member?: Maybe<CompanyMember>;
  created_at?: Maybe<Scalars['DateTime']>;
  friday?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['ID']>;
  monday?: Maybe<Scalars['Int']>;
  saturday?: Maybe<Scalars['Int']>;
  sunday?: Maybe<Scalars['Int']>;
  task?: Maybe<Task>;
  thursday?: Maybe<Scalars['Int']>;
  total_weekly?: Maybe<Scalars['Int']>;
  tuesday?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['DateTime']>;
  wednesday?: Maybe<Scalars['Int']>;
  week_number?: Maybe<Scalars['Int']>;
};

export type AddCompanyTeamStatusInput = {
  color: Scalars['String'];
  label: Scalars['String'];
  parentStatus?: InputMaybe<CompanyTeamStatusType>;
  parent_status: CompanyTeamStatusType;
  percentage: Scalars['Int'];
  stage?: InputMaybe<StageType>;
};

export type AddCustomValueToTaskInput = {
  attributeId: Scalars['ID'];
  groupId: Scalars['ID'];
  taskId: Scalars['ID'];
  value: Scalars['String'];
};

export type AddMemberToCompanyInput = {
  email: Scalars['String'];
  employeeTypeId?: InputMaybe<Scalars['ID']>;
  employee_type_id?: InputMaybe<Scalars['ID']>;
  hourlyRate?: InputMaybe<Scalars['Float']>;
  hourly_rate?: InputMaybe<Scalars['Float']>;
  position?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<CompanyMemberType>;
};

export type AddMembersToContactGroupInput = {
  contactIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  contact_ids: Array<InputMaybe<Scalars['ID']>>;
};

export type AddPackageInput = {
  packagePriceId?: InputMaybe<Scalars['ID']>;
  package_price_id: Scalars['ID'];
  quantity?: InputMaybe<Scalars['Int']>;
};

export type AddTaskWatchersInput = {
  memberIds: Array<Scalars['ID']>;
  taskId: Scalars['ID'];
};

export type AddToProjectVisibilityWhitelistInput = {
  memberIds?: InputMaybe<Array<Scalars['ID']>>;
  projectId: Scalars['ID'];
  teamIds?: InputMaybe<Array<Scalars['ID']>>;
};

export type AddToTaskVisibilityWhitelistInput = {
  memberIds?: InputMaybe<Array<Scalars['ID']>>;
  taskId: Scalars['ID'];
  teamIds?: InputMaybe<Array<Scalars['ID']>>;
};

export type AddToVisibilityWhitelistInput = {
  boardId: Scalars['ID'];
  memberIds?: InputMaybe<Array<Scalars['ID']>>;
  teamIds?: InputMaybe<Array<Scalars['ID']>>;
};

export type AddToWorkspaceVisibilityWhitelistInput = {
  memberIds?: InputMaybe<Array<Scalars['ID']>>;
  teamIds?: InputMaybe<Array<Scalars['ID']>>;
  workspaceId: Scalars['ID'];
};

export type ApplyTaskTemplateInput = {
  companyId: Scalars['ID'];
  companyTeamId?: InputMaybe<Scalars['ID']>;
  taskBoardId: Scalars['ID'];
  templateId: Scalars['ID'];
};

export type ArchiveTaskInput = {
  task_ids: Array<InputMaybe<Scalars['ID']>>;
};

export type ArchivedStatus = {
  status?: InputMaybe<TimesheetArchiveStatus>;
};

export type AssignMembersToCollectionInput = {
  collectionId: Scalars['ID'];
  memberIds: Array<Scalars['ID']>;
};

export type AssignProjectsToWorkspaceInput = {
  projectIds: Array<Scalars['ID']>;
  workspaceId: Scalars['ID'];
};

export type AssignTaskBoardsToFolderInput = {
  boardIds: Array<Scalars['ID']>;
  folderId: Scalars['ID'];
};

export type Attendance = {
  __typename?: 'Attendance';
  address?: Maybe<Scalars['String']>;
  comments?: Maybe<Scalars['String']>;
  commentsOut?: Maybe<Scalars['String']>;
  comments_out?: Maybe<Scalars['String']>;
  companyMember?: Maybe<CompanyMember>;
  company_member?: Maybe<CompanyMember>;
  contact?: Maybe<Contact>;
  createdAt?: Maybe<Scalars['DateTime']>;
  created_at?: Maybe<Scalars['DateTime']>;
  endDate?: Maybe<Scalars['DateTime']>;
  end_date?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  image_url?: Maybe<Scalars['String']>;
  isLastOut?: Maybe<Scalars['Boolean']>;
  is_last_out?: Maybe<Scalars['Boolean']>;
  label?: Maybe<AttendanceLabel>;
  lat?: Maybe<Scalars['Latitude']>;
  lng?: Maybe<Scalars['Longitude']>;
  location?: Maybe<Location>;
  overtime?: Maybe<Scalars['Int']>;
  s3Bucket?: Maybe<Scalars['String']>;
  s3Key?: Maybe<Scalars['String']>;
  s3_bucket?: Maybe<Scalars['String']>;
  s3_key?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['DateTime']>;
  start_date?: Maybe<Scalars['DateTime']>;
  submittedDate?: Maybe<Scalars['DateTime']>;
  submitted_date?: Maybe<Scalars['DateTime']>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  timeTotal?: Maybe<Scalars['Int']>;
  time_total?: Maybe<Scalars['Int']>;
  type?: Maybe<AttendanceType>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updated_at?: Maybe<Scalars['DateTime']>;
  verificationType?: Maybe<AttendanceVerificationType>;
  verification_type?: Maybe<AttendanceVerificationType>;
  worked?: Maybe<Scalars['Int']>;
};

export type AttendanceDaySummary = {
  __typename?: 'AttendanceDaySummary';
  attendances?: Maybe<Array<Maybe<Attendance>>>;
  companyMember?: Maybe<CompanyMember>;
  company_member?: Maybe<CompanyMember>;
  createdAt?: Maybe<Scalars['DateTime']>;
  created_at?: Maybe<Scalars['DateTime']>;
  day?: Maybe<Scalars['Int']>;
  firstAttendance?: Maybe<Attendance>;
  /** Deprecated */
  firstIn?: Maybe<Scalars['DateTime']>;
  generatedAt?: Maybe<Scalars['DateTime']>;
  generated_at?: Maybe<Scalars['DateTime']>;
  lastAttendance?: Maybe<Attendance>;
  month?: Maybe<Scalars['Int']>;
  overtime?: Maybe<Scalars['Int']>;
  regular?: Maybe<Scalars['Int']>;
  tracked?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updated_at?: Maybe<Scalars['DateTime']>;
  worked?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
};

export type AttendanceDaySummaryInput = {
  companyMemberId?: InputMaybe<Scalars['ID']>;
  day: Scalars['Int'];
  month: Scalars['Int'];
  year: Scalars['Int'];
};

export type AttendanceLabel = {
  __typename?: 'AttendanceLabel';
  archived?: Maybe<Scalars['Boolean']>;
  color?: Maybe<Scalars['String']>;
  company?: Maybe<Company>;
  createdAt?: Maybe<Scalars['DateTime']>;
  created_at?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updated_at?: Maybe<Scalars['DateTime']>;
};

export type AttendanceLabelInput = {
  color?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type AttendanceMemberStats = {
  __typename?: 'AttendanceMemberStats';
  break?: Maybe<Scalars['Int']>;
  overtime?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
  worked?: Maybe<Scalars['Int']>;
};

export type AttendanceMonthSummary = {
  __typename?: 'AttendanceMonthSummary';
  companyMember?: Maybe<CompanyMember>;
  company_member?: Maybe<CompanyMember>;
  month?: Maybe<Scalars['Int']>;
  overtimeTotal?: Maybe<Scalars['Int']>;
  overtime_total?: Maybe<Scalars['Int']>;
  regularTotal?: Maybe<Scalars['Int']>;
  regular_total?: Maybe<Scalars['Int']>;
  trackedTotal?: Maybe<Scalars['Int']>;
  tracked_total?: Maybe<Scalars['Int']>;
  workedTotal?: Maybe<Scalars['Int']>;
  worked_total?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
};

export type AttendanceMonthSummaryInput = {
  companyMemberId?: InputMaybe<Scalars['ID']>;
  month: Scalars['Int'];
  week: Array<InputMaybe<Scalars['Int']>>;
  year: Scalars['Int'];
};

export type AttendanceSettings = {
  __typename?: 'AttendanceSettings';
  allowMobile?: Maybe<Scalars['Boolean']>;
  allowWeb?: Maybe<Scalars['Boolean']>;
  allow_mobile?: Maybe<Scalars['Boolean']>;
  allow_web?: Maybe<Scalars['Boolean']>;
  enable2d?: Maybe<Scalars['Boolean']>;
  enableBiometric?: Maybe<Scalars['Boolean']>;
  enable_2d?: Maybe<Scalars['Boolean']>;
  enable_biometric?: Maybe<Scalars['Boolean']>;
  requireLocation?: Maybe<Scalars['Boolean']>;
  requireVerification?: Maybe<Scalars['Boolean']>;
  require_location?: Maybe<Scalars['Boolean']>;
  require_verification?: Maybe<Scalars['Boolean']>;
};

export enum AttendanceType {
  Break = 'BREAK',
  Clock = 'CLOCK'
}

export type AttendanceVerificationS3Object = {
  bucket: Scalars['String'];
  key: Scalars['String'];
};

export enum AttendanceVerificationType {
  Biometric = 'BIOMETRIC',
  DevicePasscode = 'DEVICE_PASSCODE',
  ImageCompare = 'IMAGE_COMPARE'
}

export type AttendanceWeekSummary = {
  __typename?: 'AttendanceWeekSummary';
  companyMember?: Maybe<CompanyMember>;
  company_member?: Maybe<CompanyMember>;
  createdAt?: Maybe<Scalars['DateTime']>;
  created_at?: Maybe<Scalars['DateTime']>;
  friday?: Maybe<Scalars['Int']>;
  generatedAt?: Maybe<Scalars['DateTime']>;
  generated_at?: Maybe<Scalars['DateTime']>;
  monday?: Maybe<Scalars['Int']>;
  month?: Maybe<Scalars['Int']>;
  overtimeTotal?: Maybe<Scalars['Int']>;
  overtime_total?: Maybe<Scalars['Int']>;
  regularTotal?: Maybe<Scalars['Int']>;
  regular_total?: Maybe<Scalars['Int']>;
  saturday?: Maybe<Scalars['Int']>;
  sunday?: Maybe<Scalars['Int']>;
  thursday?: Maybe<Scalars['Int']>;
  trackedTotal?: Maybe<Scalars['Int']>;
  tracked_total?: Maybe<Scalars['Int']>;
  tuesday?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updated_at?: Maybe<Scalars['DateTime']>;
  wednesday?: Maybe<Scalars['Int']>;
  week?: Maybe<Scalars['Int']>;
  workedTotal?: Maybe<Scalars['Int']>;
  worked_total?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
};

export type AttendanceWeekSummaryInput = {
  companyMemberId?: InputMaybe<Scalars['ID']>;
  month: Scalars['Int'];
  week: Scalars['Int'];
  year: Scalars['Int'];
};

export type AuditLogChangedValues = {
  __typename?: 'AuditLogChangedValues';
  archive?: Maybe<Scalars['Boolean']>;
  collectionPayment?: Maybe<Scalars['Boolean']>;
  collection_payment?: Maybe<Scalars['Boolean']>;
  collectorMember?: Maybe<Scalars['Boolean']>;
  collector_member?: Maybe<Scalars['Boolean']>;
  companyMember?: Maybe<Scalars['Boolean']>;
  companyTeam?: Maybe<Scalars['Boolean']>;
  company_member?: Maybe<Scalars['Boolean']>;
  company_team?: Maybe<Scalars['Boolean']>;
  contactAddress?: Maybe<Scalars['Boolean']>;
  contactGroup?: Maybe<Scalars['Boolean']>;
  contactName?: Maybe<Scalars['Boolean']>;
  contactNo?: Maybe<Scalars['Boolean']>;
  contactPicName?: Maybe<Scalars['Boolean']>;
  contactType?: Maybe<Scalars['Boolean']>;
  contact_address?: Maybe<Scalars['Boolean']>;
  contact_group?: Maybe<Scalars['Boolean']>;
  contact_name?: Maybe<Scalars['Boolean']>;
  contact_no?: Maybe<Scalars['Boolean']>;
  contact_pic_name?: Maybe<Scalars['Boolean']>;
  contact_type?: Maybe<Scalars['Boolean']>;
  dueDate?: Maybe<Scalars['Boolean']>;
  due_date?: Maybe<Scalars['Boolean']>;
  invoice?: Maybe<Scalars['Boolean']>;
  isCreate?: Maybe<Scalars['Boolean']>;
  is_create?: Maybe<Scalars['Boolean']>;
  markedPaid?: Maybe<Scalars['Boolean']>;
  marked_paid?: Maybe<Scalars['Boolean']>;
  notifyPics?: Maybe<Scalars['Boolean']>;
  notify_pics?: Maybe<Scalars['Boolean']>;
  refNo?: Maybe<Scalars['Boolean']>;
  ref_no?: Maybe<Scalars['Boolean']>;
  rejectedPayment?: Maybe<Scalars['Boolean']>;
  rejected_payment?: Maybe<Scalars['Boolean']>;
  title?: Maybe<Scalars['Boolean']>;
  uploadedPayment?: Maybe<Scalars['Boolean']>;
  uploadedReceipt?: Maybe<Scalars['Boolean']>;
  uploaded_payment?: Maybe<Scalars['Boolean']>;
  uploaded_receipt?: Maybe<Scalars['Boolean']>;
};

export type AuditLogValues = {
  __typename?: 'AuditLogValues';
  archive?: Maybe<Scalars['Int']>;
  attachmentName?: Maybe<Scalars['String']>;
  attachment_name?: Maybe<Scalars['String']>;
  contactAddress?: Maybe<Scalars['String']>;
  contactGroupName?: Maybe<Scalars['String']>;
  contactName?: Maybe<Scalars['String']>;
  contactNo?: Maybe<Scalars['String']>;
  contactPicName?: Maybe<Scalars['String']>;
  contactType?: Maybe<Scalars['String']>;
  contact_address?: Maybe<Scalars['String']>;
  contact_group_name?: Maybe<Scalars['String']>;
  contact_name?: Maybe<Scalars['String']>;
  contact_no?: Maybe<Scalars['String']>;
  contact_pic_name?: Maybe<Scalars['String']>;
  contact_type?: Maybe<Scalars['String']>;
  dueDate?: Maybe<Scalars['String']>;
  due_date?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  memberName?: Maybe<Scalars['String']>;
  member_name?: Maybe<Scalars['String']>;
  refNo?: Maybe<Scalars['String']>;
  ref_no?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Int']>;
  teamName?: Maybe<Scalars['String']>;
  team_name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type BillingInvoice = {
  __typename?: 'BillingInvoice';
  contactPic?: Maybe<ContactPic>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  docDate?: Maybe<Scalars['DateTime']>;
  docNo?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  items?: Maybe<Array<Maybe<BillingInvoiceItem>>>;
  project?: Maybe<TaskBoard>;
  remarks?: Maybe<Scalars['String']>;
  terms?: Maybe<Scalars['Int']>;
  /** Total discounted is calculated first before tax is applied. */
  totalDiscounted?: Maybe<Scalars['Float']>;
  totalReceived?: Maybe<Scalars['Float']>;
  /** Total taxed is calculated after discount */
  totalTaxed?: Maybe<Scalars['Float']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  void?: Maybe<Scalars['Boolean']>;
  voidedAt?: Maybe<Scalars['DateTime']>;
  voidedBy?: Maybe<User>;
};

export type BillingInvoiceItem = {
  __typename?: 'BillingInvoiceItem';
  /** aka amount */
  billed?: Maybe<Scalars['Float']>;
  billingInvoice?: Maybe<BillingInvoice>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  descriptionHdr?: Maybe<Scalars['String']>;
  discountPercentage?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['ID']>;
  /** Either task name or the custom name, aka descriptionDtl */
  itemName?: Maybe<Scalars['String']>;
  qty?: Maybe<Scalars['Int']>;
  sequence?: Maybe<Scalars['Int']>;
  task?: Maybe<Task>;
  tax?: Maybe<Scalars['String']>;
  taxAmount?: Maybe<Scalars['Float']>;
  taxInclusive?: Maybe<Scalars['Boolean']>;
  taxPercentage?: Maybe<Scalars['Float']>;
  unitPrice?: Maybe<Scalars['Float']>;
  uom?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
};

export type BreadcrumbInfo = {
  __typename?: 'BreadcrumbInfo';
  name?: Maybe<Scalars['String']>;
};

export enum BreadcrumbType {
  Client = 'CLIENT',
  Collection = 'COLLECTION',
  CompanySlug = 'COMPANY_SLUG',
  Crm = 'CRM',
  Payments = 'PAYMENTS',
  ProjectBoard = 'PROJECT_BOARD',
  TaskBoard = 'TASK_BOARD',
  Timesheet = 'TIMESHEET'
}

export type BulkUploadContactsResponse = {
  __typename?: 'BulkUploadContactsResponse';
  contacts?: Maybe<Array<Maybe<Contact>>>;
};

export type BulkUploadMembersResponse = {
  __typename?: 'BulkUploadMembersResponse';
  companyMembers?: Maybe<Array<Maybe<CompanyMember>>>;
  duplicateEmails?: Maybe<Scalars['Int']>;
};

export type CancelSubscriptionInput = {
  companyId: Scalars['ID'];
  reason?: InputMaybe<Scalars['String']>;
  subscriptionId: Scalars['ID'];
};

export type ChangeGroupTaskInput = {
  groupId: Scalars['ID'];
  taskIds: Array<Scalars['ID']>;
};

export type ChangeTaskPositionInput = {
  posY: Scalars['Float'];
  projectStatusId?: InputMaybe<Scalars['ID']>;
  taskId: Scalars['ID'];
};

export type Checklist = {
  __typename?: 'Checklist';
  checked?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  sequence?: Maybe<Scalars['Int']>;
  task?: Maybe<Task>;
  title?: Maybe<Scalars['String']>;
};

export type ChecklistInput = {
  title: Scalars['String'];
};

export type ChecklistSequencesInput = {
  checklistId: Scalars['ID'];
  sequence?: InputMaybe<Scalars['Int']>;
};

export type ChecklistUpdateInput = {
  checked?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
};

export type CollaborationBoardInput = {
  category?: InputMaybe<TaskBoardCategory>;
  color?: InputMaybe<Scalars['String']>;
  companyId?: InputMaybe<Scalars['ID']>;
  company_id: Scalars['ID'];
  contactId?: InputMaybe<Scalars['ID']>;
  contact_id: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  owners?: InputMaybe<Array<Scalars['String']>>;
  status: Scalars['Int'];
  type: TaskBoardType;
};

export type Collection = {
  __typename?: 'Collection';
  active?: Maybe<Scalars['Boolean']>;
  activityLogs?: Maybe<Array<Maybe<CollectionActivityLog>>>;
  archive?: Maybe<Scalars['Boolean']>;
  archiveAt?: Maybe<Scalars['DateTime']>;
  archive_at?: Maybe<Scalars['DateTime']>;
  assignees?: Maybe<Array<Maybe<CompanyMember>>>;
  collectionPeriods?: Maybe<Array<Maybe<CollectionPeriod>>>;
  collection_periods?: Maybe<Array<Maybe<CollectionPeriod>>>;
  collector?: Maybe<Collector>;
  contact?: Maybe<Contact>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<User>;
  description?: Maybe<Scalars['String']>;
  dueDate?: Maybe<Scalars['DateTime']>;
  due_date?: Maybe<Scalars['DateTime']>;
  emailNotify?: Maybe<Scalars['Boolean']>;
  email_notify?: Maybe<Scalars['Boolean']>;
  endMonth?: Maybe<Scalars['DateTime']>;
  end_month?: Maybe<Scalars['DateTime']>;
  fileName?: Maybe<Scalars['String']>;
  file_name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  invoice?: Maybe<Scalars['String']>;
  invoiceFileSize?: Maybe<Scalars['Int']>;
  invoice_file_size?: Maybe<Scalars['Int']>;
  isDraft?: Maybe<Scalars['Boolean']>;
  is_draft?: Maybe<Scalars['Boolean']>;
  messageLogs?: Maybe<Array<Maybe<CollectionMessageLog>>>;
  message_logs?: Maybe<Array<Maybe<CollectionMessageLog>>>;
  notifyPics?: Maybe<Array<Maybe<ContactPic>>>;
  notify_pics?: Maybe<Array<Maybe<ContactPic>>>;
  payableAmount?: Maybe<Scalars['Float']>;
  payable_amount?: Maybe<Scalars['Float']>;
  paymentType?: Maybe<CollectionPaymentTypes>;
  payment_type?: Maybe<CollectionPaymentTypes>;
  periods?: Maybe<Scalars['Int']>;
  refNo?: Maybe<Scalars['String']>;
  ref_no?: Maybe<Scalars['String']>;
  remindEndOn?: Maybe<Scalars['DateTime']>;
  remindInterval?: Maybe<CollectionRemindIntervalTypes>;
  remindOnDate?: Maybe<Scalars['Int']>;
  remindOnDays?: Maybe<Array<Maybe<CollectionRemindOnDays>>>;
  remindOnMonth?: Maybe<Scalars['Int']>;
  remindType?: Maybe<CollectionRemindTypes>;
  remind_end_on?: Maybe<Scalars['DateTime']>;
  remind_interval?: Maybe<CollectionRemindIntervalTypes>;
  remind_on_date?: Maybe<Scalars['Int']>;
  remind_on_days?: Maybe<Array<Maybe<CollectionRemindOnDays>>>;
  remind_on_month?: Maybe<Scalars['Int']>;
  remind_type?: Maybe<CollectionRemindTypes>;
  /** Not from receivable_reminders DB */
  reminderStatus?: Maybe<ReminderStatus>;
  reminder_status?: Maybe<ReminderStatus>;
  shortLink?: Maybe<Scalars['String']>;
  short_link?: Maybe<Scalars['String']>;
  smsNotify?: Maybe<Scalars['Boolean']>;
  sms_notify?: Maybe<Scalars['Boolean']>;
  spRecurringId?: Maybe<Scalars['String']>;
  sp_recurring_id?: Maybe<Scalars['String']>;
  startMonth?: Maybe<Scalars['DateTime']>;
  start_month?: Maybe<Scalars['DateTime']>;
  status?: Maybe<CollectionStatusTypes>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  title?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  updated_at?: Maybe<Scalars['DateTime']>;
  updated_by?: Maybe<User>;
  voiceNotify?: Maybe<Scalars['Boolean']>;
  voice_notify?: Maybe<Scalars['Boolean']>;
  whatsappNotify?: Maybe<Scalars['Boolean']>;
  whatsapp_notify?: Maybe<Scalars['Boolean']>;
};

export enum CollectionActionType {
  CollectionAddedMember = 'COLLECTION_ADDED_MEMBER',
  CollectionArchived = 'COLLECTION_ARCHIVED',
  CollectionCreated = 'COLLECTION_CREATED',
  CollectionManualResend = 'COLLECTION_MANUAL_RESEND',
  CollectionMarkedPaid = 'COLLECTION_MARKED_PAID',
  CollectionMarkedUnpaid = 'COLLECTION_MARKED_UNPAID',
  CollectionPaymentApproved = 'COLLECTION_PAYMENT_APPROVED',
  CollectionPaymentRejected = 'COLLECTION_PAYMENT_REJECTED',
  CollectionPicUpdated = 'COLLECTION_PIC_UPDATED',
  CollectionReminderOptionUpdated = 'COLLECTION_REMINDER_OPTION_UPDATED',
  CollectionRemoved = 'COLLECTION_REMOVED',
  CollectionRemovedMember = 'COLLECTION_REMOVED_MEMBER',
  CollectionUnarchived = 'COLLECTION_UNARCHIVED',
  CollectionUpdatedDueDate = 'COLLECTION_UPDATED_DUE_DATE',
  CollectionUpdatedName = 'COLLECTION_UPDATED_NAME',
  CollectionUpdatedRefNo = 'COLLECTION_UPDATED_REF_NO',
  CollectionUpdatedReminder = 'COLLECTION_UPDATED_REMINDER',
  CollectionUpdatedTitle = 'COLLECTION_UPDATED_TITLE',
  CollectionUploadedPayment = 'COLLECTION_UPLOADED_PAYMENT',
  CollectionUploadedReceipt = 'COLLECTION_UPLOADED_RECEIPT'
}

export enum CollectionActiveTypes {
  False = 'FALSE',
  True = 'TRUE'
}

export type CollectionActivityLog = {
  __typename?: 'CollectionActivityLog';
  actionType?: Maybe<CollectionActionType>;
  changedValues?: Maybe<Scalars['JSON']>;
  collection?: Maybe<Collection>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  currentValues?: Maybe<Scalars['JSON']>;
  previousValues?: Maybe<Scalars['JSON']>;
};

export enum CollectionArchiveType {
  False = 'FALSE',
  True = 'TRUE'
}

export enum CollectionDraftType {
  False = 'FALSE',
  True = 'TRUE'
}

export type CollectionMessageLog = {
  __typename?: 'CollectionMessageLog';
  collection?: Maybe<Collection>;
  emailAddress?: Maybe<Scalars['String']>;
  email_address?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  phone?: Maybe<Scalars['String']>;
  status?: Maybe<CollectionMessageLogStatusTypes>;
  timestamp?: Maybe<Scalars['DateTime']>;
  type?: Maybe<Scalars['String']>;
};

export enum CollectionMessageLogStatusTypes {
  Failed = 'FAILED',
  Sent = 'SENT'
}

export type CollectionPayment = {
  __typename?: 'CollectionPayment';
  collection?: Maybe<Collection>;
  collectionPeriod?: Maybe<CollectionPeriod>;
  collection_period?: Maybe<CollectionPeriod>;
  companyMember?: Maybe<CompanyMember>;
  company_member?: Maybe<CompanyMember>;
  contact?: Maybe<Contact>;
  contactPic?: Maybe<ContactPic>;
  contact_pic?: Maybe<ContactPic>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<User>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  deletedBy?: Maybe<User>;
  deleted_at?: Maybe<Scalars['DateTime']>;
  deleted_by?: Maybe<User>;
  id?: Maybe<Scalars['ID']>;
  paymentProof?: Maybe<Scalars['String']>;
  paymentProofFileName?: Maybe<Scalars['String']>;
  paymentProofFileSize?: Maybe<Scalars['String']>;
  payment_proof?: Maybe<Scalars['String']>;
  payment_proof_file_name?: Maybe<Scalars['String']>;
  payment_proof_file_size?: Maybe<Scalars['String']>;
  receipt?: Maybe<Scalars['String']>;
  receiptFileName?: Maybe<Scalars['String']>;
  receiptFileSize?: Maybe<Scalars['Int']>;
  receipt_file_name?: Maybe<Scalars['String']>;
  receipt_file_size?: Maybe<Scalars['Int']>;
  remarks?: Maybe<Scalars['String']>;
  status?: Maybe<CollectionPaymentStatusTypes>;
  transactionId?: Maybe<Scalars['String']>;
  transaction_id?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  updated_at?: Maybe<Scalars['DateTime']>;
  updated_by?: Maybe<User>;
};

export enum CollectionPaymentStatusTypes {
  Approved = 'APPROVED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export enum CollectionPaymentTypes {
  Manual = 'MANUAL',
  Senangpay = 'SENANGPAY'
}

export type CollectionPeriod = {
  __typename?: 'CollectionPeriod';
  amount?: Maybe<Scalars['Float']>;
  collection?: Maybe<Collection>;
  createdAt?: Maybe<Scalars['DateTime']>;
  created_at?: Maybe<Scalars['DateTime']>;
  dueDate?: Maybe<Scalars['DateTime']>;
  due_date?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['ID']>;
  lastRemindOn?: Maybe<Scalars['DateTime']>;
  last_remind_on?: Maybe<Scalars['DateTime']>;
  month?: Maybe<Scalars['DateTime']>;
  paymentAcceptAt?: Maybe<Scalars['DateTime']>;
  payment_accept_at?: Maybe<Scalars['DateTime']>;
  payments?: Maybe<Array<Maybe<CollectionPayment>>>;
  period?: Maybe<Scalars['Int']>;
  status?: Maybe<CollectionStatusTypes>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updated_at?: Maybe<Scalars['DateTime']>;
  webhookData?: Maybe<Scalars['String']>;
  webhook_data?: Maybe<Scalars['String']>;
};

export enum CollectionPeriodStatusTypes {
  Paid = 'PAID',
  Pending = 'PENDING'
}

export enum CollectionRemindIntervalTypes {
  Day = 'Day',
  Month = 'Month',
  Week = 'Week',
  Year = 'Year'
}

export type CollectionRemindOnDays = {
  __typename?: 'CollectionRemindOnDays';
  collection?: Maybe<Collection>;
  createdAt?: Maybe<Scalars['DateTime']>;
  created_at?: Maybe<Scalars['DateTime']>;
  day?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['ID']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updated_at?: Maybe<Scalars['DateTime']>;
};

export enum CollectionRemindTypes {
  Full = 'FULL',
  Instalment = 'INSTALMENT'
}

export type CollectionReminderRead = {
  __typename?: 'CollectionReminderRead';
  collection?: Maybe<Collection>;
  createdAt?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  user?: Maybe<User>;
};

export enum CollectionStatusTypes {
  Paid = 'PAID',
  Pending = 'PENDING'
}

export type CollectionTag = {
  __typename?: 'CollectionTag';
  collection?: Maybe<Collection>;
  tag?: Maybe<Tag>;
};

export type CollectionTagOptions = {
  collectionId: Scalars['ID'];
  tagIds: Array<Scalars['ID']>;
};

export type Collector = {
  __typename?: 'Collector';
  assignees?: Maybe<Array<Maybe<CompanyMember>>>;
  collections?: Maybe<Array<Maybe<Collection>>>;
  collectorMembers?: Maybe<Array<Maybe<CollectorMember>>>;
  collector_members?: Maybe<Array<Maybe<CollectorMember>>>;
  company?: Maybe<Company>;
  contact?: Maybe<Contact>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<User>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  deletedBy?: Maybe<User>;
  deleted_at?: Maybe<Scalars['DateTime']>;
  deleted_by?: Maybe<User>;
  id?: Maybe<Scalars['ID']>;
  team?: Maybe<CompanyTeam>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  updated_at?: Maybe<Scalars['DateTime']>;
  updated_by?: Maybe<User>;
};


export type CollectorCollectionsArgs = {
  filters?: InputMaybe<FilterOptions>;
};

export type CollectorMember = {
  __typename?: 'CollectorMember';
  id?: Maybe<Scalars['ID']>;
  member?: Maybe<CompanyMember>;
};

export type CommonCrud = {
  create?: InputMaybe<Scalars['Boolean']>;
  delete?: InputMaybe<Scalars['Boolean']>;
  read?: InputMaybe<Scalars['Boolean']>;
  update?: InputMaybe<Scalars['Boolean']>;
};

export enum CommonVisibility {
  Assigned = 'ASSIGNED',
  Hidden = 'HIDDEN',
  Private = 'PRIVATE',
  Public = 'PUBLIC',
  Specific = 'SPECIFIC'
}

export type CommonVisibilityWhitelist = {
  __typename?: 'CommonVisibilityWhitelist';
  members?: Maybe<Array<Maybe<CompanyMember>>>;
  teams?: Maybe<Array<Maybe<CompanyTeam>>>;
};

export type Company = {
  __typename?: 'Company';
  /** Only for invoice generation */
  accountCode?: Maybe<Scalars['String']>;
  activeSubscription?: Maybe<Array<Maybe<CompanySubscription>>>;
  active_subscription?: Maybe<Array<Maybe<CompanySubscription>>>;
  address?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<User>;
  currentSubscription?: Maybe<Subscription>;
  defaultTimezone?: Maybe<Scalars['String']>;
  default_timezone?: Maybe<Scalars['String']>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  deletedBy?: Maybe<User>;
  deleted_at?: Maybe<Scalars['DateTime']>;
  deleted_by?: Maybe<User>;
  description?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  emailEnabled?: Maybe<Scalars['Boolean']>;
  email_enabled?: Maybe<Scalars['Boolean']>;
  employeeTypes?: Maybe<Array<Maybe<EmployeeType>>>;
  employee_types?: Maybe<Array<Maybe<EmployeeType>>>;
  expiredSubscription?: Maybe<Array<Maybe<CompanySubscription>>>;
  id?: Maybe<Scalars['ID']>;
  id_num?: Maybe<Scalars['Int']>;
  idleTiming?: Maybe<Scalars['Int']>;
  idle_timing?: Maybe<Scalars['Int']>;
  invitationCode?: Maybe<Scalars['String']>;
  invitationValidity?: Maybe<Scalars['DateTime']>;
  invitation_code?: Maybe<Scalars['String']>;
  invitation_validity?: Maybe<Scalars['DateTime']>;
  /** Only for invoice generation */
  invoicePrefix?: Maybe<Scalars['String']>;
  invoiceStart?: Maybe<Scalars['Int']>;
  logoUrl?: Maybe<Scalars['String']>;
  logo_url?: Maybe<Scalars['String']>;
  members?: Maybe<Array<Maybe<CompanyMember>>>;
  name?: Maybe<Scalars['String']>;
  permission?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  phoneCallEnabled?: Maybe<Scalars['Boolean']>;
  phone_call_enabled?: Maybe<Scalars['Boolean']>;
  registrationCode?: Maybe<Scalars['String']>;
  settings?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  smsEnabled?: Maybe<Scalars['Boolean']>;
  sms_enabled?: Maybe<Scalars['Boolean']>;
  subscriptions?: Maybe<Array<Maybe<CompanySubscription>>>;
  teams?: Maybe<Array<Maybe<CompanyTeam>>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  updated_at?: Maybe<Scalars['DateTime']>;
  updated_by?: Maybe<User>;
  user?: Maybe<User>;
  website?: Maybe<Scalars['String']>;
  whatsappEnabled?: Maybe<Scalars['Boolean']>;
  whatsapp_enabled?: Maybe<Scalars['Boolean']>;
};

export enum CompanyArchivedUpdate {
  Archived = 'ARCHIVED',
  Unarchived = 'UNARCHIVED'
}

export type CompanyHoliday = {
  __typename?: 'CompanyHoliday';
  active?: Maybe<Scalars['Boolean']>;
  company?: Maybe<Company>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<User>;
  endDate?: Maybe<Scalars['DateTime']>;
  end_date?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  publicHolidayId?: Maybe<PublicHoliday>;
  public_holiday_id?: Maybe<PublicHoliday>;
  startDate?: Maybe<Scalars['DateTime']>;
  start_date?: Maybe<Scalars['DateTime']>;
  type?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  updated_at?: Maybe<Scalars['DateTime']>;
  updated_by?: Maybe<User>;
};

export enum CompanyHolidayStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export type CompanyMember = {
  __typename?: 'CompanyMember';
  active?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  created_at?: Maybe<Scalars['DateTime']>;
  employeeType?: Maybe<EmployeeType>;
  employee_type?: Maybe<EmployeeType>;
  hourlyRate?: Maybe<Scalars['Float']>;
  hourly_rate?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  permissions?: Maybe<Array<Maybe<CompanyMemberPermissionScope>>>;
  position?: Maybe<Scalars['String']>;
  referenceImage?: Maybe<CompanyMemberReferenceImage>;
  reference_image?: Maybe<CompanyMemberReferenceImage>;
  setting?: Maybe<CompanyMemberSettings>;
  teams?: Maybe<Array<Maybe<CompanyTeam>>>;
  type?: Maybe<CompanyMemberType>;
  user?: Maybe<User>;
};

export type CompanyMemberPermissionScope = {
  __typename?: 'CompanyMemberPermissionScope';
  enabled?: Maybe<Scalars['Boolean']>;
  scope?: Maybe<Scalars['String']>;
};

/** Describes the reference image of the member for face verification */
export type CompanyMemberReferenceImage = {
  __typename?: 'CompanyMemberReferenceImage';
  actionBy?: Maybe<User>;
  action_by?: Maybe<User>;
  createdAt?: Maybe<Scalars['DateTime']>;
  created_at?: Maybe<Scalars['DateTime']>;
  imageUrl?: Maybe<Scalars['String']>;
  image_url?: Maybe<Scalars['String']>;
  remark?: Maybe<Scalars['String']>;
  s3Bucket?: Maybe<Scalars['String']>;
  s3Key?: Maybe<Scalars['String']>;
  s3_bucket?: Maybe<Scalars['String']>;
  s3_key?: Maybe<Scalars['String']>;
  status?: Maybe<CompanyMemberReferenceImageStatus>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updated_at?: Maybe<Scalars['DateTime']>;
};

export type CompanyMemberReferenceImageResponse = {
  __typename?: 'CompanyMemberReferenceImageResponse';
  s3Bucket?: Maybe<Scalars['String']>;
  s3Key?: Maybe<Scalars['String']>;
  s3_bucket?: Maybe<Scalars['String']>;
  s3_key?: Maybe<Scalars['String']>;
  uploadUrl?: Maybe<Scalars['String']>;
  upload_url?: Maybe<Scalars['String']>;
};

export enum CompanyMemberReferenceImageStatus {
  Approved = 'APPROVED',
  PendingApproval = 'PENDING_APPROVAL',
  Rejected = 'REJECTED'
}

export type CompanyMemberSettings = {
  __typename?: 'CompanyMemberSettings';
  senangPay?: Maybe<Scalars['Int']>;
  senang_pay?: Maybe<Scalars['Int']>;
};

export enum CompanyMemberType {
  Admin = 'ADMIN',
  Manager = 'MANAGER',
  Member = 'MEMBER'
}

export type CompanyPaymentMethod = {
  __typename?: 'CompanyPaymentMethod';
  brand?: Maybe<Scalars['String']>;
  company?: Maybe<Company>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  expMonth?: Maybe<Scalars['String']>;
  expYear?: Maybe<Scalars['String']>;
  isDefault?: Maybe<Scalars['Boolean']>;
  last4?: Maybe<Scalars['String']>;
  stripeCustomerId?: Maybe<Scalars['String']>;
  stripePaymentMethodId?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  user?: Maybe<User>;
};

export type CompanyPermission = {
  __typename?: 'CompanyPermission';
  company?: Maybe<Company>;
  grants?: Maybe<Scalars['String']>;
};

export type CompanyStorageDetails = {
  __typename?: 'CompanyStorageDetails';
  summary?: Maybe<Array<Maybe<CompanyStorageList>>>;
  totalUsageInKB?: Maybe<Scalars['Float']>;
  totalUsageInMB?: Maybe<Scalars['Float']>;
};

export type CompanyStorageList = {
  __typename?: 'CompanyStorageList';
  fileSize?: Maybe<Scalars['Float']>;
  type?: Maybe<Scalars['String']>;
};

export type CompanySubscription = {
  __typename?: 'CompanySubscription';
  active?: Maybe<Scalars['Boolean']>;
  cancelDate?: Maybe<Scalars['DateTime']>;
  cancel_date?: Maybe<Scalars['DateTime']>;
  company?: Maybe<Company>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<User>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  deletedBy?: Maybe<User>;
  deleted_at?: Maybe<Scalars['DateTime']>;
  deleted_by?: Maybe<User>;
  discount?: Maybe<SubscriptionDiscount>;
  emailQuota?: Maybe<Scalars['Int']>;
  email_quota?: Maybe<Scalars['Int']>;
  endDate?: Maybe<Scalars['DateTime']>;
  end_date?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  interval?: Maybe<Scalars['String']>;
  intervalCount?: Maybe<Scalars['Int']>;
  interval_count?: Maybe<Scalars['Int']>;
  package?: Maybe<SubscriptionPackage>;
  packageDescription?: Maybe<Scalars['String']>;
  packageTitle?: Maybe<Scalars['String']>;
  package_description?: Maybe<Scalars['String']>;
  package_title?: Maybe<Scalars['String']>;
  phoneCallQuota?: Maybe<Scalars['Int']>;
  phone_call_quota?: Maybe<Scalars['Int']>;
  price?: Maybe<Scalars['Float']>;
  productId?: Maybe<Scalars['String']>;
  product_id?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  signatureQuota?: Maybe<Scalars['Int']>;
  signature_quota?: Maybe<Scalars['Int']>;
  smsQuota?: Maybe<Scalars['Int']>;
  sms_quota?: Maybe<Scalars['Int']>;
  startDate?: Maybe<Scalars['DateTime']>;
  start_date?: Maybe<Scalars['DateTime']>;
  status?: Maybe<SubscriptionStatuses>;
  stripeSubscriptionId?: Maybe<Scalars['String']>;
  stripe_subscription_id?: Maybe<Scalars['String']>;
  subscriptionPackagePrice?: Maybe<SubscriptionPackagePrice>;
  type?: Maybe<PackageTypes>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  updated_at?: Maybe<Scalars['DateTime']>;
  updated_by?: Maybe<User>;
  whatsappQuota?: Maybe<Scalars['Int']>;
  whatsapp_quota?: Maybe<Scalars['Int']>;
  whiteListedMembers?: Maybe<SubscriptionQuantityResult>;
};

export type CompanyTeam = {
  __typename?: 'CompanyTeam';
  company?: Maybe<Company>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<User>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  deletedBy?: Maybe<User>;
  deleted_at?: Maybe<Scalars['DateTime']>;
  deleted_by?: Maybe<User>;
  id: Scalars['ID'];
  members?: Maybe<Array<Maybe<CompanyMember>>>;
  statuses?: Maybe<Array<Maybe<CompanyTeamStatus>>>;
  title?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  updated_at?: Maybe<Scalars['DateTime']>;
  updated_by?: Maybe<User>;
};

/** Also referred to as "dynamic statuses". Refers to table card_statuses */
export type CompanyTeamStatus = {
  __typename?: 'CompanyTeamStatus';
  color?: Maybe<Scalars['String']>;
  company?: Maybe<Company>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<User>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  deletedBy?: Maybe<User>;
  deleted_at?: Maybe<Scalars['DateTime']>;
  deleted_by?: Maybe<User>;
  id: Scalars['ID'];
  label?: Maybe<Scalars['String']>;
  parentStatus?: Maybe<CompanyTeamStatusType>;
  parent_status?: Maybe<CompanyTeamStatusType>;
  percentage?: Maybe<Scalars['Int']>;
  sequence?: Maybe<Scalars['Int']>;
  stage?: Maybe<StageType>;
  team?: Maybe<CompanyTeam>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  updated_at?: Maybe<Scalars['DateTime']>;
  updated_by?: Maybe<User>;
};

export type CompanyTeamStatusSequenceInput = {
  companyTeamStatusId?: InputMaybe<Scalars['ID']>;
  company_team_status_id: Scalars['ID'];
  sequence: Scalars['Int'];
};

export enum CompanyTeamStatusType {
  Done = 'DONE',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type CompanyWorkDaySetting = {
  __typename?: 'CompanyWorkDaySetting';
  company?: Maybe<Company>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<User>;
  day?: Maybe<WorkDay>;
  endHour?: Maybe<Scalars['String']>;
  end_hour?: Maybe<Scalars['String']>;
  open?: Maybe<Scalars['Boolean']>;
  startHour?: Maybe<Scalars['String']>;
  start_hour?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  updated_at?: Maybe<Scalars['DateTime']>;
  updated_by?: Maybe<User>;
};

export type Contact = {
  __typename?: 'Contact';
  /** Only for invoice generation */
  accountCode?: Maybe<Scalars['String']>;
  activities?: Maybe<Array<Maybe<ContactActivityRaw>>>;
  address?: Maybe<Scalars['String']>;
  attendances?: Maybe<Array<Maybe<Attendance>>>;
  collections?: Maybe<Array<Maybe<Collection>>>;
  company?: Maybe<Company>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<User>;
  dealCreator?: Maybe<User>;
  dealValue?: Maybe<Scalars['Float']>;
  deal_creator?: Maybe<User>;
  deal_value?: Maybe<Scalars['Float']>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  deletedBy?: Maybe<User>;
  deleted_at?: Maybe<Scalars['DateTime']>;
  deleted_by?: Maybe<User>;
  edited?: Maybe<Scalars['Boolean']>;
  groups?: Maybe<Array<Maybe<ContactGroup>>>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  notes?: Maybe<Array<Maybe<ContactNote>>>;
  pics?: Maybe<Array<Maybe<ContactPic>>>;
  remarks?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  taskBoards?: Maybe<Array<Maybe<TaskBoard>>>;
  task_boards?: Maybe<Array<Maybe<TaskBoard>>>;
  type?: Maybe<ContactType>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  updated_at?: Maybe<Scalars['DateTime']>;
  updated_by?: Maybe<User>;
};


export type ContactActivitiesArgs = {
  isCount: Scalars['Boolean'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  tableType: ContactActivityTableType;
};

export type ContactActivity = {
  __typename?: 'ContactActivity';
  activityType?: Maybe<Scalars['String']>;
  activity_type?: Maybe<Scalars['String']>;
  assignee?: Maybe<CompanyMember>;
  attachment?: Maybe<TaskAttachment>;
  createdBy?: Maybe<User>;
  created_by?: Maybe<User>;
  date?: Maybe<Scalars['DateTime']>;
  fromDate?: Maybe<Scalars['DateTime']>;
  from_date?: Maybe<Scalars['DateTime']>;
  pic?: Maybe<ContactPic>;
  task?: Maybe<Task>;
  toDate?: Maybe<Scalars['DateTime']>;
  to_date?: Maybe<Scalars['DateTime']>;
};

export type ContactActivityRaw = {
  __typename?: 'ContactActivityRaw';
  action?: Maybe<Scalars['String']>;
  changedValues?: Maybe<Scalars['String']>;
  changed_values?: Maybe<Scalars['String']>;
  currentValues?: Maybe<Scalars['String']>;
  current_values?: Maybe<Scalars['String']>;
  previousValues?: Maybe<Scalars['String']>;
  previous_values?: Maybe<Scalars['String']>;
  tableName?: Maybe<Scalars['String']>;
  table_name?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['DateTime']>;
};

export enum ContactActivityTableType {
  All = 'ALL',
  Collections = 'COLLECTIONS',
  Contacts = 'CONTACTS',
  Tasks = 'TASKS'
}

export enum ContactActivityType {
  AssigneeAdded = 'ASSIGNEE_ADDED',
  AssigneeRemoved = 'ASSIGNEE_REMOVED',
  AttachmentRemoved = 'ATTACHMENT_REMOVED',
  AttachmentUploaded = 'ATTACHMENT_UPLOADED',
  PicAdded = 'PIC_ADDED',
  PicRemoved = 'PIC_REMOVED',
  TaskArchived = 'TASK_ARCHIVED',
  TaskCreated = 'TASK_CREATED',
  TaskRemoved = 'TASK_REMOVED',
  TaskUnarchived = 'TASK_UNARCHIVED',
  UpdatedDueDate = 'UPDATED_DUE_DATE',
  UpdatedTeamStatus = 'UPDATED_TEAM_STATUS'
}

export type ContactGroup = {
  __typename?: 'ContactGroup';
  color?: Maybe<Scalars['String']>;
  company?: Maybe<Company>;
  contacts?: Maybe<Array<Maybe<Contact>>>;
  count?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  created_at?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  type?: Maybe<ContactGroupType>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updated_at?: Maybe<Scalars['DateTime']>;
};

export enum ContactGroupType {
  Company = 'COMPANY',
  Individual = 'INDIVIDUAL',
  Unassigned = 'UNASSIGNED'
}

export type ContactNote = {
  __typename?: 'ContactNote';
  contact?: Maybe<Contact>;
  content?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['ID']>;
  noteContent?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type ContactNoteInput = {
  content?: InputMaybe<Scalars['String']>;
  date?: InputMaybe<Scalars['DateTime']>;
  noteContent?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['ID']>;
  user_id?: InputMaybe<Scalars['ID']>;
};

export type ContactPic = {
  __typename?: 'ContactPic';
  contact?: Maybe<Contact>;
  contactNo?: Maybe<Scalars['String']>;
  contact_no?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<User>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  deletedBy?: Maybe<User>;
  deleted_at?: Maybe<Scalars['DateTime']>;
  deleted_by?: Maybe<User>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  nationalFormat?: Maybe<Scalars['String']>;
  national_format?: Maybe<Scalars['String']>;
  remarks?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  updated_at?: Maybe<Scalars['DateTime']>;
  updated_by?: Maybe<User>;
  user?: Maybe<User>;
};

export type ContactTag = {
  __typename?: 'ContactTag';
  contact?: Maybe<Contact>;
  tag?: Maybe<Tag>;
};

export type ContactTagOptions = {
  contactId: Scalars['ID'];
  tagIds: Array<Scalars['ID']>;
};

export type ContactTask = {
  __typename?: 'ContactTask';
  dueDate?: Maybe<Scalars['DateTime']>;
  due_date?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  status?: Maybe<ContactTaskStatusType>;
};

export enum ContactTaskStatusType {
  Done = 'DONE',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export enum ContactType {
  Company = 'COMPANY',
  Individual = 'INDIVIDUAL',
  None = 'NONE'
}

export type CopyProjectInput = {
  projectId: Scalars['ID'];
  targetWorkspaceId: Scalars['ID'];
};

export type CopyTaskInput = {
  companyId: Scalars['ID'];
  companyTeamId?: InputMaybe<Scalars['ID']>;
  copyAttachments: Scalars['Boolean'];
  copySubtasks: Scalars['Boolean'];
  taskBoardId: Scalars['ID'];
  taskId: Scalars['ID'];
};

export type CopyTasksInput = {
  companyId: Scalars['ID'];
  companyTeamId?: InputMaybe<Scalars['ID']>;
  copyAttachments: Scalars['Boolean'];
  copySubtasks: Scalars['Boolean'];
  taskBoardId: Scalars['ID'];
  taskIds: Array<Scalars['ID']>;
};

export type CreateBillingInvoiceInput = {
  docDate: Scalars['DateTime'];
  /** Get companyName from contactId */
  picId: Scalars['ID'];
  projectId: Scalars['ID'];
  /** Maximum 200 characters */
  remarks?: InputMaybe<Scalars['String']>;
  terms?: InputMaybe<Scalars['Int']>;
};

export type CreateBillingInvoiceItemInput = {
  customName?: InputMaybe<Scalars['String']>;
  discountPercentage?: InputMaybe<Scalars['Float']>;
  invoiceId: Scalars['ID'];
  taskId?: InputMaybe<Scalars['ID']>;
  taxPercentage?: InputMaybe<Scalars['Float']>;
  unitPrice?: InputMaybe<Scalars['Float']>;
};

export type CreateCollectionInput = {
  contactId?: InputMaybe<Scalars['ID']>;
  contact_id: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  dueDate?: InputMaybe<Scalars['DateTime']>;
  due_date?: InputMaybe<Scalars['DateTime']>;
  emailNotify?: InputMaybe<Scalars['Boolean']>;
  email_notify?: InputMaybe<Scalars['Boolean']>;
  endMonth?: InputMaybe<Scalars['DateTime']>;
  end_month?: InputMaybe<Scalars['DateTime']>;
  isDraft?: InputMaybe<Scalars['Boolean']>;
  is_draft: Scalars['Boolean'];
  notifyPics?: InputMaybe<Array<Scalars['ID']>>;
  notifyTypes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  notify_pics?: InputMaybe<Array<Scalars['ID']>>;
  notify_types?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  payableAmount?: InputMaybe<Scalars['Float']>;
  payable_amount: Scalars['Float'];
  paymentType?: InputMaybe<CollectionPaymentTypes>;
  payment_type?: InputMaybe<CollectionPaymentTypes>;
  periods?: InputMaybe<Scalars['Int']>;
  refNo?: InputMaybe<Scalars['String']>;
  ref_no: Scalars['String'];
  remindEndOn?: InputMaybe<Scalars['DateTime']>;
  remindInterval?: InputMaybe<CollectionRemindIntervalTypes>;
  remindOnDate?: InputMaybe<Scalars['Int']>;
  remindOnMonth?: InputMaybe<Scalars['Int']>;
  remindType?: InputMaybe<CollectionRemindTypes>;
  remind_end_on?: InputMaybe<Scalars['DateTime']>;
  remind_interval?: InputMaybe<CollectionRemindIntervalTypes>;
  remind_on_date?: InputMaybe<Scalars['Int']>;
  remind_on_month?: InputMaybe<Scalars['Int']>;
  remind_type?: InputMaybe<CollectionRemindTypes>;
  smsNotify?: InputMaybe<Scalars['Boolean']>;
  sms_notify?: InputMaybe<Scalars['Boolean']>;
  startMonth?: InputMaybe<Scalars['DateTime']>;
  start_month?: InputMaybe<Scalars['DateTime']>;
  tagIds?: InputMaybe<Array<Scalars['ID']>>;
  title: Scalars['String'];
  voiceNotify?: InputMaybe<Scalars['Boolean']>;
  voice_notify?: InputMaybe<Scalars['Boolean']>;
  whatsappNotify?: InputMaybe<Scalars['Boolean']>;
  whatsapp_notify?: InputMaybe<Scalars['Boolean']>;
};

export type CreateCollectionPaymentInput = {
  collectionId?: InputMaybe<Scalars['ID']>;
  collectionPeriodId?: InputMaybe<Scalars['ID']>;
  collection_id: Scalars['ID'];
  collection_period_id: Scalars['ID'];
};

export type CreateCollectorInput = {
  contactId?: InputMaybe<Scalars['ID']>;
  contact_id: Scalars['ID'];
  memberIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  member_ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  teamId?: InputMaybe<Scalars['ID']>;
  team_id?: InputMaybe<Scalars['ID']>;
};

export type CreateCompanyHolidayInput = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  end_date: Scalars['DateTime'];
  name: Scalars['String'];
  startDate?: InputMaybe<Scalars['DateTime']>;
  start_date: Scalars['DateTime'];
};

export type CreateCompanyInput = {
  /** Only for invoice generation */
  accountCode?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type CreateCompanyPaymentMethodInput = {
  companyId: Scalars['ID'];
  stripePaymentMethodId: Scalars['String'];
};

export type CreateCompanyTeamInput = {
  memberIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  member_ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  title: Scalars['String'];
};

export type CreateContactGroupInput = {
  name: Scalars['String'];
};

export type CreateContactInput = {
  /** Only for invoice generation */
  accountCode?: InputMaybe<Scalars['String']>;
  address?: InputMaybe<Scalars['String']>;
  dealValue?: InputMaybe<Scalars['Float']>;
  deal_value?: InputMaybe<Scalars['Float']>;
  name: Scalars['String'];
  remarks?: InputMaybe<Scalars['String']>;
  tagIds?: InputMaybe<Array<Scalars['ID']>>;
  type: ContactType;
};

export type CreateContactPicInput = {
  contactNo?: InputMaybe<Scalars['String']>;
  contact_no?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  remarks?: InputMaybe<Scalars['String']>;
};

export type CreateCustomColumnForGroupInput = {
  groupId: Scalars['ID'];
  name: Scalars['String'];
  type: ProjectGroupCustomAttributeType;
};

export type CreateCustomTimesheetApprovalInput = {
  customName: Scalars['String'];
  daysInput: TimesheetDaysInput;
};

export type CreateCustomTimesheetApprovalsInput = {
  companyMemberId: Scalars['ID'];
  customInput: Array<CreateCustomTimesheetApprovalInput>;
};

export type CreateLocationInput = {
  address?: InputMaybe<Scalars['String']>;
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
  metadata?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  radius?: InputMaybe<Scalars['Float']>;
};

export type CreateProjectGroupInput = {
  name: Scalars['String'];
  projectId: Scalars['ID'];
};

export type CreateProjectInput = {
  companyId: Scalars['ID'];
  name: Scalars['String'];
  ownerIds?: InputMaybe<Array<Scalars['ID']>>;
  projectTemplateId?: InputMaybe<Scalars['ID']>;
  visibility?: InputMaybe<ProjectVisibility>;
  workspaceId: Scalars['ID'];
};

export type CreateProjectStatusInput = {
  color: Scalars['String'];
  name: Scalars['String'];
  notify?: InputMaybe<Scalars['Boolean']>;
  projectId: Scalars['ID'];
};

export type CreateProjectTemplateStatusInput = {
  color: Scalars['String'];
  name: Scalars['String'];
  notify: Scalars['Boolean'];
  projectTemplateId: Scalars['ID'];
};

export type CreateSubscriptionInput = {
  packagePriceId?: InputMaybe<Scalars['ID']>;
  package_price_id: Scalars['ID'];
  quantity?: InputMaybe<Scalars['Int']>;
};

export type CreateSubscriptionPackageInput = {
  invoiceQuota?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  reportQuota?: InputMaybe<Scalars['Int']>;
  storageQuota?: InputMaybe<Scalars['Int']>;
  taskQuota?: InputMaybe<Scalars['Int']>;
  teamQuota?: InputMaybe<Scalars['Int']>;
  userQuota?: InputMaybe<Scalars['Int']>;
};

export type CreateSubscriptionPriceInput = {
  amount: Scalars['Float'];
  interval?: InputMaybe<SubscriptionPriceInterval>;
  productId: Scalars['String'];
};

export type CreateSubscriptionProductInput = {
  name: Scalars['String'];
};

export type CreateTagGroupInput = {
  companyId: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type CreateTagInput = {
  color: Scalars['String'];
  companyId: Scalars['ID'];
  groupId?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
};

export type CreateTaskBoardFolderInput = {
  name: Scalars['String'];
  type: TaskBoardFolderType;
};

export type CreateTaskTemplateInput = {
  companyId: Scalars['ID'];
  copyAttachments: Scalars['Boolean'];
  copySubtasks: Scalars['Boolean'];
  /** Sending a cronString means it will be classified as recurring and no longer should be listed as a template */
  cronString?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  /** Deprecated, sending a cronString will automatically mark it as recurring */
  isRecurring?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  sourceTaskId: Scalars['ID'];
};

export type CreateTimesheetApprovalInput = {
  daysInput: TimesheetDaysInput;
  taskId: Scalars['ID'];
};

export type CreateTimesheetApprovalsInput = {
  companyMemberId: Scalars['ID'];
  tasksInput: Array<CreateTimesheetApprovalInput>;
};

export type CreateWorkspaceInput = {
  bgColor: Scalars['String'];
  companyId: Scalars['ID'];
  name: Scalars['String'];
};

export type CustomTimesheetApprovalInput = {
  companyMemberId?: InputMaybe<Scalars['ID']>;
  customName: Scalars['String'];
};

export type CustomTimesheetDayApproval = {
  __typename?: 'CustomTimesheetDayApproval';
  billable?: Maybe<Scalars['Boolean']>;
  companyMember?: Maybe<CompanyMember>;
  customName?: Maybe<Scalars['String']>;
  day?: Maybe<Scalars['Int']>;
  month?: Maybe<Scalars['Int']>;
  status?: Maybe<TimesheetApprovalStatus>;
  total?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
};

export type DateRangeFilter = {
  end_date?: InputMaybe<Scalars['DateTime']>;
  start_date?: InputMaybe<Scalars['DateTime']>;
};

export type DayTimesheetFilterOptions = {
  companyMemberId?: InputMaybe<Scalars['ID']>;
  day: Scalars['Int'];
  month: Scalars['Int'];
  taskId?: InputMaybe<Scalars['ID']>;
  year: Scalars['Int'];
};

export type DeleteCollectorInput = {
  collectorIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  collector_ids: Array<InputMaybe<Scalars['ID']>>;
  companyId?: InputMaybe<Scalars['ID']>;
  company_id: Scalars['ID'];
};

export type DeleteCompanyPaymentMethodInput = {
  companyId: Scalars['ID'];
  stripePaymentMethodId: Scalars['String'];
};

export type DeleteCompanyPaymentMethodResponse = {
  __typename?: 'DeleteCompanyPaymentMethodResponse';
  affectedNum?: Maybe<Scalars['Int']>;
  success?: Maybe<Scalars['Boolean']>;
};

export type DeleteContactPicResponse = {
  __typename?: 'DeleteContactPicResponse';
  contact?: Maybe<Contact>;
};

export type DeleteCustomColumnForGroupInput = {
  attributeId: Scalars['ID'];
  groupId: Scalars['ID'];
};

export type DeleteCustomTimesheetApprovalInput = {
  customName: Scalars['String'];
  daysInput: DeleteTimesheetDaysInput;
};

export type DeleteCustomTimesheetApprovalsInput = {
  companyMemberId: Scalars['ID'];
  customInput: Array<DeleteCustomTimesheetApprovalInput>;
};

export type DeleteCustomValueFromTaskInput = {
  attributeId: Scalars['ID'];
  groupId: Scalars['ID'];
  taskId: Scalars['ID'];
};

export type DeletePaymentProofInput = {
  collectionId?: InputMaybe<Scalars['ID']>;
  collectionPaymentId?: InputMaybe<Scalars['ID']>;
  collectionPeriodId?: InputMaybe<Scalars['ID']>;
  collection_id: Scalars['ID'];
  collection_payment_id: Scalars['ID'];
  collection_period_id: Scalars['ID'];
};

export type DeleteProjectGroupInput = {
  projectGroupIds: Array<Scalars['ID']>;
};

export type DeleteProjectStatusInput = {
  projectStatusIds: Array<Scalars['ID']>;
};

export type DeleteProjectTemplateIdsInput = {
  projectTemplateIds: Array<Scalars['ID']>;
};

export type DeleteProjectsInput = {
  projectIds: Array<Scalars['ID']>;
};

export type DeleteTemplateInput = {
  companyId: Scalars['ID'];
  templateId: Scalars['ID'];
};

export type DeleteTimesheetDaysInput = {
  day: Scalars['Int'];
  month: Scalars['Int'];
  year: Scalars['Int'];
};

export type DeleteWorkspacesInput = {
  workspaceIds: Array<Scalars['ID']>;
};

export type DiscountedPrice = {
  __typename?: 'DiscountedPrice';
  active?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  discountedPrice?: Maybe<Scalars['Float']>;
  discounted_price?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Int']>;
  interval?: Maybe<Scalars['String']>;
  intervalCount?: Maybe<Scalars['Int']>;
  interval_count?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  package?: Maybe<SubscriptionPackage>;
  price?: Maybe<Scalars['Float']>;
  pricePerUnit?: Maybe<Scalars['Float']>;
  price_per_unit?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Int']>;
  stripePriceId?: Maybe<Scalars['String']>;
  stripe_price_id?: Maybe<Scalars['String']>;
};

export type DowngradeSubscriptionInput = {
  companyId: Scalars['ID'];
  interval: SubscriptionPriceInterval;
  packageId: Scalars['ID'];
  subscriptionId: Scalars['ID'];
};

export type DowngradeSubscriptionPackageProductsInput = {
  packageId: Scalars['ID'];
  productId: Scalars['ID'];
};

export type DuplicateTasksInput = {
  parentId?: InputMaybe<Scalars['ID']>;
  projectGroupId?: InputMaybe<Scalars['ID']>;
  projectId: Scalars['ID'];
  taskIds: Array<Scalars['ID']>;
};

export type EditCustomColumnForGroupInput = {
  attributeId: Scalars['ID'];
  groupId: Scalars['ID'];
  name: Scalars['String'];
};

export type EditProjectGroupInput = {
  name: Scalars['String'];
  projectGroupId: Scalars['ID'];
};

/** Only works with new comment system */
export type EditTaskCommentInput = {
  commentId: Scalars['ID'];
  /** New and old mentions */
  mentionIds?: InputMaybe<Array<Scalars['ID']>>;
  messageContent: Scalars['ID'];
};

export type EmployeeType = {
  __typename?: 'EmployeeType';
  archived?: Maybe<Scalars['Boolean']>;
  hasOvertime?: Maybe<Scalars['Boolean']>;
  has_overtime?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  /** Work schedule */
  workDaySettings?: Maybe<Array<Maybe<CompanyWorkDaySetting>>>;
};

export type ExternalAttachmentInput = {
  name: Scalars['String'];
  source: ExternalFileSource;
  type: Scalars['String'];
  url: Scalars['String'];
};

export enum ExternalFileSource {
  Dropbox = 'DROPBOX',
  GoogleDrive = 'GOOGLE_DRIVE',
  OneDrive = 'ONE_DRIVE'
}

export type FilterOptions = {
  archived?: InputMaybe<ArchivedStatus>;
  category?: InputMaybe<TaskFilterOptions>;
  date?: InputMaybe<DateRangeFilter>;
  project_type?: InputMaybe<TaskBoardType>;
  taskMember?: InputMaybe<TaskMemberFilter>;
  task_member?: InputMaybe<TaskMemberFilter>;
  team_status?: InputMaybe<TeamStatusFilter>;
};

export type GetAttendancesInput = {
  companyId?: InputMaybe<Scalars['ID']>;
  companyMemberId?: InputMaybe<Scalars['ID']>;
  company_id: Scalars['ID'];
  company_member_id?: InputMaybe<Scalars['ID']>;
  contactId?: InputMaybe<Scalars['ID']>;
  fromDate?: InputMaybe<Scalars['DateTime']>;
  from_date: Scalars['DateTime'];
  toDate?: InputMaybe<Scalars['DateTime']>;
  to_date: Scalars['DateTime'];
};

export type Holiday = {
  __typename?: 'Holiday';
  active?: Maybe<Scalars['Boolean']>;
  company?: Maybe<Company>;
  countryCode?: Maybe<Scalars['String']>;
  country_code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<User>;
  date?: Maybe<Scalars['DateTime']>;
  endDate?: Maybe<Scalars['DateTime']>;
  end_date?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['DateTime']>;
  start_date?: Maybe<Scalars['DateTime']>;
  type?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  updated_at?: Maybe<Scalars['DateTime']>;
  updated_by?: Maybe<User>;
  year?: Maybe<Scalars['Int']>;
};

export type ImageGroup = {
  __typename?: 'ImageGroup';
  large?: Maybe<Scalars['String']>;
  medium?: Maybe<Scalars['String']>;
  original?: Maybe<Scalars['String']>;
  small?: Maybe<Scalars['String']>;
};

export type ImportTasksInput = {
  attachment: Scalars['Upload'];
  groupId?: InputMaybe<Scalars['ID']>;
  projectId: Scalars['ID'];
};

export type ImportTasksResponse = {
  __typename?: 'ImportTasksResponse';
  failed?: Maybe<Scalars['Int']>;
  imported?: Maybe<Scalars['Int']>;
  tasks?: Maybe<Array<Task>>;
};

export type LinkAttachmentToCommentInput = {
  attachmentId: Scalars['ID'];
  commentId: Scalars['ID'];
};

export type LinkExternalAttachmentsInput = {
  externalAttachments: Array<ExternalAttachmentInput>;
  taskId: Scalars['ID'];
};

export type Location = {
  __typename?: 'Location';
  address?: Maybe<Scalars['String']>;
  archived?: Maybe<Scalars['Boolean']>;
  company?: Maybe<Company>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<User>;
  id: Scalars['ID'];
  lat?: Maybe<Scalars['Float']>;
  lng?: Maybe<Scalars['Float']>;
  metadata?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  radius?: Maybe<Scalars['Float']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  updated_at?: Maybe<Scalars['DateTime']>;
  updated_by?: Maybe<User>;
};

/** Refer to activity_tracker_monthly_mv */
export type MonthlyActivityTracking = {
  __typename?: 'MonthlyActivityTracking';
  company_member?: Maybe<CompanyMember>;
  created_at?: Maybe<Scalars['DateTime']>;
  task?: Maybe<Task>;
  updated_at?: Maybe<Scalars['DateTime']>;
  week_number?: Maybe<Scalars['Int']>;
  week_total?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
};

export type MonthlyTimesheetFilterOptions = {
  companyMemberId?: InputMaybe<Scalars['ID']>;
  taskId?: InputMaybe<Scalars['ID']>;
  weekNumbers?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  year?: InputMaybe<Scalars['Int']>;
};

export type MoveProjectsToWorkspaceInput = {
  destinationWorkspaceId: Scalars['ID'];
  projectIds: Array<Scalars['ID']>;
  sourceWorkspaceId: Scalars['ID'];
};

export type MoveTaskToMemberInput = {
  destinationMemberId: Scalars['ID'];
  sourceMemberId: Scalars['ID'];
  taskId: Scalars['ID'];
};

export type MoveTasksInput = {
  projectGroupId: Scalars['ID'];
  projectId: Scalars['ID'];
  taskIds: Array<Scalars['ID']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  activateCollections?: Maybe<Array<Maybe<Collection>>>;
  activatePublicHoliday?: Maybe<CompanyHoliday>;
  addCompanyTeamStatus?: Maybe<CompanyTeamStatus>;
  addCustomValueToTask?: Maybe<TaskCustomValue>;
  addExpoPushToken?: Maybe<User>;
  addMemberToCompany?: Maybe<Company>;
  addMembersToContactGroup?: Maybe<Array<Maybe<Contact>>>;
  addPackageToSubscription?: Maybe<Array<Maybe<CompanySubscription>>>;
  addSenangPayUsers?: Maybe<Array<Maybe<CompanyMember>>>;
  addSubscriptionProductToPackage?: Maybe<SubscriptionPackage>;
  addTaskWatchers?: Maybe<Array<Maybe<TaskWatcher>>>;
  addToTaskVisibilityWhitelist?: Maybe<Task>;
  addToVisibilityWhitelist?: Maybe<TaskBoard>;
  addToVisibilityWhitelistProject?: Maybe<TaskBoard>;
  addToWorkspaceVisibilityWhitelist?: Maybe<Workspace>;
  applyTaskTemplate?: Maybe<TaskTemplate>;
  archiveAttendanceLabel?: Maybe<AttendanceLabel>;
  archiveCollections?: Maybe<Array<Maybe<Collection>>>;
  archiveEmployeeType?: Maybe<EmployeeType>;
  archiveTasks?: Maybe<Array<Maybe<Task>>>;
  assignCollectionTags?: Maybe<Array<Maybe<CollectionTag>>>;
  assignContactTags?: Maybe<Array<Maybe<ContactTag>>>;
  assignMembersToCollection?: Maybe<Collection>;
  assignProjectsToWorkspace?: Maybe<Workspace>;
  assignSubscriptionQuantityToMember?: Maybe<Array<Maybe<CompanyMember>>>;
  assignTaskBoardsToFolder?: Maybe<TaskBoardFolder>;
  assignTaskMembers?: Maybe<Array<Maybe<TaskMember>>>;
  assignTaskPics?: Maybe<Array<Maybe<TaskPic>>>;
  assignTaskTags?: Maybe<Array<Maybe<TaskTag>>>;
  attachPaymentMethod?: Maybe<User>;
  bulkUploadContacts?: Maybe<BulkUploadContactsResponse>;
  bulkUploadMembers?: Maybe<BulkUploadMembersResponse>;
  cancelAllSubscriptions?: Maybe<Array<Maybe<CompanySubscription>>>;
  cancelOmniTrialSubscription?: Maybe<CompanySubscription>;
  cancelSubscription?: Maybe<CompanySubscription>;
  /**
   * Cancel subscription in this case means switching to a free plan package but there will still be a subscription
   * object available
   */
  cancelSubscriptionV2?: Maybe<Subscription>;
  changeGroupTasks?: Maybe<Array<Maybe<Task>>>;
  changeTaskPosition?: Maybe<Task>;
  /** Clock out without starting a new entry */
  closeAttendance?: Maybe<Attendance>;
  closeAttendanceForUser?: Maybe<Attendance>;
  collectionReminderRead?: Maybe<CollectionReminderRead>;
  copyProject?: Maybe<TaskBoard>;
  copyTask?: Maybe<Task>;
  copyTasks?: Maybe<Array<Maybe<Task>>>;
  createAttendanceLabel?: Maybe<AttendanceLabel>;
  createBillingInvoice?: Maybe<BillingInvoice>;
  createBillingInvoiceItem?: Maybe<BillingInvoiceItem>;
  createChecklist?: Maybe<Checklist>;
  createCollaborationBoard?: Maybe<TaskBoard>;
  createCollection?: Maybe<Collection>;
  createCollector?: Maybe<Collector>;
  createCompany?: Maybe<Company>;
  createCompanyPaymentMethod?: Maybe<CompanyPaymentMethod>;
  createCompanyTeam?: Maybe<CompanyTeam>;
  createContact?: Maybe<Contact>;
  createContactGroup?: Maybe<ContactGroup>;
  createContactNote?: Maybe<ContactNote>;
  createContactPic?: Maybe<ContactPic>;
  createCustomColumnForGroup?: Maybe<ProjectGroupCustomColumn>;
  createCustomTimesheetApprovals?: Maybe<Array<Maybe<CustomTimesheetDayApproval>>>;
  createEmployeeType?: Maybe<EmployeeType>;
  createHoliday?: Maybe<Array<Maybe<Holiday>>>;
  createLocation?: Maybe<Location>;
  createPersonalTask?: Maybe<Task>;
  createProject?: Maybe<TaskBoard>;
  createProjectClaim?: Maybe<ProjectClaim>;
  createProjectGroup?: Maybe<ProjectGroup>;
  createProjectInvoice?: Maybe<ProjectInvoice>;
  createProjectStatus?: Maybe<ProjectStatus>;
  createProjectTemplate?: Maybe<ProjectTemplate>;
  createProjectTemplateStatus?: Maybe<ProjectTemplateStatus>;
  createProjectTimeCost?: Maybe<ProjectTimeCost>;
  createShortUrl?: Maybe<ShortUrl>;
  /** Create a product first before creating a package */
  createSubscriptionPackage?: Maybe<SubscriptionPackage>;
  /**
   * After creating a new price, it takes a few seconds to be available in Stripe, so
   * it will not be available in SubscriptionProduct until it's available in Stripe
   */
  createSubscriptionPrice?: Maybe<SubscriptionProduct>;
  createSubscriptionProduct?: Maybe<SubscriptionProduct>;
  createSubtask?: Maybe<Subtask>;
  createTag?: Maybe<Tag>;
  createTagGroup?: Maybe<TagGroup>;
  createTask?: Maybe<Task>;
  createTaskBoard?: Maybe<TaskBoard>;
  createTaskBoardFolder?: Maybe<TaskBoardFolder>;
  createTaskBoardTeam?: Maybe<TaskBoardTeam>;
  createTaskTemplate?: Maybe<TaskTemplate>;
  createTimesheetApprovals?: Maybe<Array<Maybe<TimesheetDayApproval>>>;
  createTimesheetEntry?: Maybe<Timesheet>;
  createWorkspace?: Maybe<Workspace>;
  deactivateCollections?: Maybe<Array<Maybe<Collection>>>;
  deactivatePublicHoliday?: Maybe<CompanyHoliday>;
  deleteBillingInvoiceItems?: Maybe<BillingInvoiceItem>;
  deleteBillingInvoices?: Maybe<Array<Maybe<BillingInvoice>>>;
  deleteChecklists?: Maybe<Array<Maybe<Checklist>>>;
  deleteCollectionTags?: Maybe<Array<Maybe<CollectionTag>>>;
  deleteCollections?: Maybe<Array<Maybe<Collection>>>;
  deleteCollectors?: Maybe<Array<Maybe<Collector>>>;
  deleteCompany?: Maybe<Company>;
  deleteCompanyHoliday?: Maybe<CompanyHoliday>;
  deleteCompanyPaymentMethod?: Maybe<DeleteCompanyPaymentMethodResponse>;
  deleteCompanyTeam?: Maybe<CompanyTeam>;
  deleteCompanyTeamStatus?: Maybe<CompanyTeamStatus>;
  deleteContactGroup?: Maybe<ContactGroup>;
  /** Ignores ids that does not exist and deletes the ones that do. */
  deleteContactNotes?: Maybe<Array<Maybe<ContactNote>>>;
  deleteContactPic?: Maybe<DeleteContactPicResponse>;
  deleteContactTags?: Maybe<Array<Maybe<ContactTag>>>;
  deleteContacts?: Maybe<Array<Maybe<Contact>>>;
  deleteCustomColumnForGroup?: Maybe<ProjectGroupCustomColumn>;
  deleteCustomTimesheetApprovals?: Maybe<Array<Maybe<CustomTimesheetDayApproval>>>;
  deleteCustomValueFromTask?: Maybe<TaskCustomValue>;
  deleteLocations?: Maybe<Array<Maybe<Location>>>;
  deletePaymentProof?: Maybe<CollectionPayment>;
  deleteProjectClaims?: Maybe<Array<Maybe<ProjectClaim>>>;
  deleteProjectGroups?: Maybe<Array<Maybe<ProjectGroup>>>;
  deleteProjectInvoices?: Maybe<Array<Maybe<ProjectInvoice>>>;
  deleteProjectStatuses?: Maybe<Array<Maybe<ProjectStatus>>>;
  deleteProjectTemplateStatuses?: Maybe<Array<Maybe<ProjectTemplateStatus>>>;
  deleteProjectTemplates?: Maybe<Array<Maybe<ProjectTemplate>>>;
  deleteProjectTimeCosts?: Maybe<Array<Maybe<ProjectTimeCost>>>;
  deleteProjects?: Maybe<Array<Maybe<TaskBoard>>>;
  deleteSubscriptionProduct?: Maybe<SubscriptionProduct>;
  deleteSubtasks?: Maybe<Array<Maybe<Subtask>>>;
  deleteTag?: Maybe<Tag>;
  deleteTagGroup?: Maybe<TagGroup>;
  deleteTaskAttachments?: Maybe<Array<Maybe<TaskAttachment>>>;
  deleteTaskBoardFolder?: Maybe<TaskBoardFolder>;
  deleteTaskBoardTeams?: Maybe<Array<Maybe<TaskBoardTeam>>>;
  deleteTaskBoards?: Maybe<Array<Maybe<TaskBoard>>>;
  deleteTaskComment?: Maybe<TaskComment>;
  deleteTaskMembers?: Maybe<Array<Maybe<TaskMember>>>;
  deleteTaskPics?: Maybe<Array<Maybe<TaskPic>>>;
  deleteTaskTags?: Maybe<Array<Maybe<TaskTag>>>;
  deleteTaskTemplate?: Maybe<TaskTemplate>;
  deleteTasks?: Maybe<Array<Maybe<Task>>>;
  deleteWorkspaces?: Maybe<Array<Maybe<Workspace>>>;
  detachPaymentMethod?: Maybe<User>;
  /** Only for downgrading to a lower subscription plan. If moving to free plan use cancelSubscription. */
  downgradeSubscription?: Maybe<Subscription>;
  /** Include x-company-id in headers */
  duplicateTasks?: Maybe<Array<Maybe<Task>>>;
  editCustomColumnForGroup?: Maybe<ProjectGroupCustomColumn>;
  editPackageQuantity?: Maybe<CompanySubscription>;
  editProjectClaim?: Maybe<ProjectClaim>;
  editProjectGroup?: Maybe<ProjectGroup>;
  editProjectInvoice?: Maybe<ProjectInvoice>;
  editProjectSettings?: Maybe<ProjectSettings>;
  editProjectStatus?: Maybe<ProjectStatus>;
  editProjectTemplate?: Maybe<ProjectTemplate>;
  editProjectTemplateStatus?: Maybe<ProjectTemplateStatus>;
  editProjectTimeCost?: Maybe<ProjectTimeCost>;
  editTaskComment?: Maybe<TaskComment>;
  importTasks?: Maybe<ImportTasksResponse>;
  linkAttachmentToComment?: Maybe<TaskComment>;
  linkExternalAttachments?: Maybe<Task>;
  loginUser?: Maybe<User>;
  moveProjectsToWorkspace?: Maybe<Array<Maybe<Workspace>>>;
  moveTaskToMember?: Maybe<Task>;
  moveTasks?: Maybe<Array<Maybe<Task>>>;
  postTaskComment?: Maybe<TaskComment>;
  receivePaymentInvoice?: Maybe<BillingInvoice>;
  removeExpoPushToken?: Maybe<User>;
  removeFromTaskVisibilityWhitelist?: Maybe<Task>;
  removeFromVisibilityWhitelist?: Maybe<TaskBoard>;
  removeFromVisibilityWhitelistProject?: Maybe<TaskBoard>;
  removeFromWorkspaceVisibilityWhitelist?: Maybe<Workspace>;
  removeMemberFromCompany?: Maybe<Company>;
  removeMemberFromCompanyTeam?: Maybe<CompanyTeam>;
  removeMemberFromContactGroup?: Maybe<ContactGroup>;
  removeMembersFromCollection?: Maybe<Collection>;
  removePackagesFromSubscription?: Maybe<Array<Maybe<CompanySubscription>>>;
  removeProjectsFromWorkspace?: Maybe<Workspace>;
  removeSenangPayUsers?: Maybe<Array<Maybe<CompanyMember>>>;
  removeSubscriptionProductFromPackage?: Maybe<SubscriptionPackage>;
  removeSubscriptionQuantityFromMember?: Maybe<Array<Maybe<CompanyMember>>>;
  removeTaskBoardsFromFolder?: Maybe<Array<Maybe<TaskBoard>>>;
  removeTaskPics?: Maybe<Array<Maybe<TaskPic>>>;
  removeTaskWatchers?: Maybe<Array<Maybe<TaskWatcher>>>;
  reorderGroups?: Maybe<Array<Maybe<ProjectGroup>>>;
  requestAccountDeletion?: Maybe<RequestAccountDeletionResponse>;
  requestDedocoSubscription?: Maybe<CompanySubscription>;
  requestOmniSubscription?: Maybe<Array<Maybe<CompanySubscription>>>;
  requestSubscription?: Maybe<CompanySubscription>;
  requestTrialOmniSubscription?: Maybe<Array<Maybe<CompanySubscription>>>;
  resendCollectionNotification?: Maybe<Notification>;
  sendInvoice?: Maybe<BillingInvoice>;
  setAttendanceVerificationImage?: Maybe<Attendance>;
  setCompanyMemberReferenceImage?: Maybe<CompanyMember>;
  setCompanyMemberReferenceImageStatus?: Maybe<Array<Maybe<CompanyMember>>>;
  setDefaultCompany?: Maybe<User>;
  /**
   * The default payment option here refers to the card which will be used for creating GK transactions but
   * it may not be the default card on the customer's Stripe object because the same customer may have different cards
   * set as default across different companies
   */
  setDefaultCompanyPaymentMethod?: Maybe<CompanyPaymentMethod>;
  setDefaultUserTimezone?: Maybe<User>;
  setProjectVisibility?: Maybe<TaskBoard>;
  setTaskBoardVisibility?: Maybe<TaskBoard>;
  setTaskVisibility?: Maybe<Task>;
  setWorkspaceVisibility?: Maybe<Workspace>;
  /**
   * Starts an attendance for either CLOCK or BREAK. If there is an open entry it will
   * close it first.
   */
  startAttendanceEntry?: Maybe<Attendance>;
  /** This is the new implementation of creating subscriptions */
  startSubscription?: Maybe<Subscription>;
  startTaskTimer?: Maybe<TaskTimerEntry>;
  stopMemberActivityTracker?: Maybe<Timesheet>;
  stopTaskTimer?: Maybe<TaskTimerEntry>;
  switchSubscriptionPackage?: Maybe<CompanySubscription>;
  toggleEnabledCustomColumn?: Maybe<ProjectGroupCustomColumn>;
  toggleTaskBoardPinned?: Maybe<TaskBoard>;
  toggleTaskBoardsPinned?: Maybe<Array<Maybe<TaskBoard>>>;
  toggleTasksPinned?: Maybe<Array<Maybe<Task>>>;
  toggleTasksPublishStatus?: Maybe<Array<Maybe<Task>>>;
  unarchiveCollections?: Maybe<Array<Maybe<Collection>>>;
  unarchiveTasks?: Maybe<Array<Maybe<Task>>>;
  unlinkAttachmentFromComment?: Maybe<TaskComment>;
  updateAllRead?: Maybe<Array<Maybe<UserNotification>>>;
  updateAttendanceLabel?: Maybe<AttendanceLabel>;
  updateAttendanceSettings?: Maybe<AttendanceSettings>;
  updateBillingInvoice?: Maybe<BillingInvoice>;
  updateBillingInvoiceItem?: Maybe<BillingInvoiceItem>;
  updateChecklist?: Maybe<Checklist>;
  updateChecklistSequences?: Maybe<Array<Maybe<Checklist>>>;
  updateCollection?: Maybe<Collection>;
  updateCollectionPaymentType?: Maybe<Collection>;
  updateCollectionPeriodStatus?: Maybe<CollectionPeriod>;
  updateCollector?: Maybe<Collector>;
  updateCompanyHoliday?: Maybe<CompanyHoliday>;
  updateCompanyInfo?: Maybe<Company>;
  updateCompanyMemberActiveStatus?: Maybe<CompanyMember>;
  updateCompanyMemberInfo?: Maybe<CompanyMember>;
  updateCompanyProfile?: Maybe<Scalars['String']>;
  updateCompanyTeamInfo?: Maybe<CompanyTeam>;
  updateCompanyTeamStatus?: Maybe<CompanyTeamStatus>;
  updateCompanyTeamStatusSequences?: Maybe<Array<Maybe<CompanyTeamStatus>>>;
  updateCompanyTimezone?: Maybe<Scalars['String']>;
  updateCompanyWorkDaySetting?: Maybe<CompanyWorkDaySetting>;
  updateContact?: Maybe<Contact>;
  updateContactGroup?: Maybe<ContactGroup>;
  updateContactNote?: Maybe<ContactNote>;
  updateContactPic?: Maybe<ContactPic>;
  updateCustomTimesheetApprovals?: Maybe<Array<Maybe<CustomTimesheetDayApproval>>>;
  updateEmployeeType?: Maybe<EmployeeType>;
  updateIsRead?: Maybe<UserNotification>;
  updateLocation?: Maybe<Location>;
  updateLocationArchivedStatus?: Maybe<Array<Maybe<Location>>>;
  updatePaymentMethodId?: Maybe<User>;
  updatePaymentStatus?: Maybe<CollectionPayment>;
  updatePersonalTask?: Maybe<Task>;
  updateProfile?: Maybe<User>;
  updateProject?: Maybe<TaskBoard>;
  updateProjectsArchivedState?: Maybe<Array<Maybe<TaskBoard>>>;
  updateSenangPayOptions?: Maybe<Company>;
  updateSubscriptionProduct?: Maybe<SubscriptionProduct>;
  updateSubtask?: Maybe<Subtask>;
  updateSubtaskSequences?: Maybe<Array<Maybe<Subtask>>>;
  updateTag?: Maybe<Tag>;
  updateTagGroup?: Maybe<TagGroup>;
  updateTask?: Maybe<Task>;
  updateTaskBoard?: Maybe<TaskBoard>;
  updateTaskBoardFolder?: Maybe<TaskBoardFolder>;
  updateTaskBoardsArchivedState?: Maybe<Array<Maybe<TaskBoard>>>;
  updateTaskComment?: Maybe<TaskComment>;
  updateTaskParent?: Maybe<UpdateTaskParentResponse>;
  updateTaskTemplate?: Maybe<TaskTemplate>;
  updateTasksSequence?: Maybe<Array<Maybe<Task>>>;
  updateTimeSheetArchivedStatus?: Maybe<Array<Maybe<Timesheet>>>;
  updateTimesheet?: Maybe<Timesheet>;
  updateTimesheetApprovals?: Maybe<Array<Maybe<TimesheetDayApproval>>>;
  updateToolTipsStatus?: Maybe<User>;
  updateUserOnboarding?: Maybe<User>;
  updateUserViewOptions?: Maybe<User>;
  updateWorkspace?: Maybe<Workspace>;
  /** This is for changing to a higher subscription plan only. Downgrading is done with the downgradeSubscription mutation. */
  upgradeSubscription?: Maybe<Subscription>;
  uploadCompanyProfileImage?: Maybe<Company>;
  uploadPaymentProof?: Maybe<CollectionPayment>;
  uploadPaymentReceipt?: Maybe<CollectionPayment>;
  uploadProfileImage?: Maybe<User>;
  uploadTaskAttachment?: Maybe<TaskAttachment>;
  /** Once voided, cannot be unvoided */
  voidInvoice?: Maybe<BillingInvoice>;
};


export type MutationActivateCollectionsArgs = {
  collectionIds: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationActivatePublicHolidayArgs = {
  companyId: Scalars['ID'];
  holidayId: Scalars['ID'];
};


export type MutationAddCompanyTeamStatusArgs = {
  input: AddCompanyTeamStatusInput;
  teamId: Scalars['ID'];
};


export type MutationAddCustomValueToTaskArgs = {
  input: AddCustomValueToTaskInput;
};


export type MutationAddExpoPushTokenArgs = {
  token: Scalars['String'];
};


export type MutationAddMemberToCompanyArgs = {
  companyId: Scalars['ID'];
  input: AddMemberToCompanyInput;
};


export type MutationAddMembersToContactGroupArgs = {
  groupId?: InputMaybe<Scalars['ID']>;
  input: AddMembersToContactGroupInput;
};


export type MutationAddPackageToSubscriptionArgs = {
  addPackageInput: Array<InputMaybe<AddPackageInput>>;
  companyId: Scalars['ID'];
};


export type MutationAddSenangPayUsersArgs = {
  companyId: Scalars['ID'];
  userIds: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationAddSubscriptionProductToPackageArgs = {
  input: UpdateSubscriptionPackageProductsInput;
};


export type MutationAddTaskWatchersArgs = {
  input: AddTaskWatchersInput;
};


export type MutationAddToTaskVisibilityWhitelistArgs = {
  input: AddToTaskVisibilityWhitelistInput;
};


export type MutationAddToVisibilityWhitelistArgs = {
  input: AddToVisibilityWhitelistInput;
};


export type MutationAddToVisibilityWhitelistProjectArgs = {
  input: AddToProjectVisibilityWhitelistInput;
};


export type MutationAddToWorkspaceVisibilityWhitelistArgs = {
  input: AddToWorkspaceVisibilityWhitelistInput;
};


export type MutationApplyTaskTemplateArgs = {
  input: ApplyTaskTemplateInput;
};


export type MutationArchiveAttendanceLabelArgs = {
  archived: Scalars['Boolean'];
  labelId: Scalars['ID'];
};


export type MutationArchiveCollectionsArgs = {
  collectionIds: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationArchiveEmployeeTypeArgs = {
  archived: Scalars['Boolean'];
  typeId: Scalars['ID'];
};


export type MutationArchiveTasksArgs = {
  input: ArchiveTaskInput;
};


export type MutationAssignCollectionTagsArgs = {
  input: CollectionTagOptions;
};


export type MutationAssignContactTagsArgs = {
  input: ContactTagOptions;
};


export type MutationAssignMembersToCollectionArgs = {
  input: AssignMembersToCollectionInput;
};


export type MutationAssignProjectsToWorkspaceArgs = {
  input: AssignProjectsToWorkspaceInput;
};


export type MutationAssignSubscriptionQuantityToMemberArgs = {
  companyMemberId: Scalars['ID'];
  stripeProductId: Scalars['String'];
};


export type MutationAssignTaskBoardsToFolderArgs = {
  input: AssignTaskBoardsToFolderInput;
};


export type MutationAssignTaskMembersArgs = {
  input: TaskMemberInput;
  taskId: Scalars['ID'];
};


export type MutationAssignTaskPicsArgs = {
  input: TaskPicInput;
  taskId: Scalars['ID'];
};


export type MutationAssignTaskTagsArgs = {
  input: TaskTagOptions;
};


export type MutationAttachPaymentMethodArgs = {
  paymentMethodId: Scalars['String'];
};


export type MutationBulkUploadContactsArgs = {
  attachment: Scalars['Upload'];
  companyId: Scalars['ID'];
  groupId?: InputMaybe<Scalars['ID']>;
};


export type MutationBulkUploadMembersArgs = {
  attachment: Scalars['Upload'];
  companyId: Scalars['ID'];
};


export type MutationCancelAllSubscriptionsArgs = {
  companyId: Scalars['ID'];
};


export type MutationCancelOmniTrialSubscriptionArgs = {
  companyId: Scalars['ID'];
  companySubscriptionId: Scalars['ID'];
};


export type MutationCancelSubscriptionArgs = {
  companyId: Scalars['ID'];
  companySubscriptionId: Scalars['ID'];
};


export type MutationCancelSubscriptionV2Args = {
  input: CancelSubscriptionInput;
};


export type MutationChangeGroupTasksArgs = {
  input: ChangeGroupTaskInput;
};


export type MutationChangeTaskPositionArgs = {
  input: ChangeTaskPositionInput;
};


export type MutationCloseAttendanceArgs = {
  commentsOut?: InputMaybe<Scalars['String']>;
  companyMemberId: Scalars['ID'];
};


export type MutationCloseAttendanceForUserArgs = {
  commentsOut?: InputMaybe<Scalars['String']>;
  companyMemberId: Scalars['ID'];
};


export type MutationCollectionReminderReadArgs = {
  collectionId: Scalars['ID'];
};


export type MutationCopyProjectArgs = {
  input: CopyProjectInput;
};


export type MutationCopyTaskArgs = {
  input: CopyTaskInput;
};


export type MutationCopyTasksArgs = {
  input: CopyTasksInput;
};


export type MutationCreateAttendanceLabelArgs = {
  companyId: Scalars['ID'];
  input: AttendanceLabelInput;
};


export type MutationCreateBillingInvoiceArgs = {
  input: CreateBillingInvoiceInput;
};


export type MutationCreateBillingInvoiceItemArgs = {
  input: CreateBillingInvoiceItemInput;
};


export type MutationCreateChecklistArgs = {
  input: ChecklistInput;
  taskId: Scalars['ID'];
};


export type MutationCreateCollaborationBoardArgs = {
  input: CollaborationBoardInput;
};


export type MutationCreateCollectionArgs = {
  attachment: Scalars['Upload'];
  input: CreateCollectionInput;
  remindOnDays?: InputMaybe<Array<Scalars['Int']>>;
};


export type MutationCreateCollectorArgs = {
  input: CreateCollectorInput;
};


export type MutationCreateCompanyArgs = {
  input: CreateCompanyInput;
};


export type MutationCreateCompanyPaymentMethodArgs = {
  input: CreateCompanyPaymentMethodInput;
};


export type MutationCreateCompanyTeamArgs = {
  companyId: Scalars['ID'];
  input: CreateCompanyTeamInput;
};


export type MutationCreateContactArgs = {
  companyId: Scalars['ID'];
  contactGroupId?: InputMaybe<Scalars['ID']>;
  dealCreator?: InputMaybe<Scalars['ID']>;
  input: CreateContactInput;
};


export type MutationCreateContactGroupArgs = {
  companyId: Scalars['ID'];
  input: CreateContactGroupInput;
};


export type MutationCreateContactNoteArgs = {
  contactId: Scalars['ID'];
  input: ContactNoteInput;
};


export type MutationCreateContactPicArgs = {
  companyId: Scalars['ID'];
  contactId: Scalars['ID'];
  input: CreateContactPicInput;
};


export type MutationCreateCustomColumnForGroupArgs = {
  input: CreateCustomColumnForGroupInput;
};


export type MutationCreateCustomTimesheetApprovalsArgs = {
  input: CreateCustomTimesheetApprovalsInput;
};


export type MutationCreateEmployeeTypeArgs = {
  companyId: Scalars['ID'];
  name: Scalars['String'];
  overtime: Scalars['Boolean'];
  timezone?: InputMaybe<Scalars['String']>;
};


export type MutationCreateHolidayArgs = {
  companyId: Scalars['ID'];
  input: CreateCompanyHolidayInput;
};


export type MutationCreateLocationArgs = {
  companyId: Scalars['ID'];
  input: CreateLocationInput;
};


export type MutationCreatePersonalTaskArgs = {
  creatorMemberId?: InputMaybe<Scalars['ID']>;
  input: TaskPersonalInput;
  memberIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationCreateProjectClaimArgs = {
  input: ProjectClaimInput;
};


export type MutationCreateProjectGroupArgs = {
  input: CreateProjectGroupInput;
};


export type MutationCreateProjectInvoiceArgs = {
  input: ProjectInvoiceInput;
};


export type MutationCreateProjectStatusArgs = {
  input: CreateProjectStatusInput;
};


export type MutationCreateProjectTemplateArgs = {
  input: ProjectTemplateInput;
};


export type MutationCreateProjectTemplateStatusArgs = {
  input: CreateProjectTemplateStatusInput;
};


export type MutationCreateProjectTimeCostArgs = {
  input: ProjectTimeCostInput;
};


export type MutationCreateShortUrlArgs = {
  url: Scalars['String'];
};


export type MutationCreateSubscriptionPackageArgs = {
  input: CreateSubscriptionPackageInput;
};


export type MutationCreateSubscriptionPriceArgs = {
  input: CreateSubscriptionPriceInput;
};


export type MutationCreateSubscriptionProductArgs = {
  input: CreateSubscriptionProductInput;
};


export type MutationCreateSubtaskArgs = {
  input: SubtaskInput;
  taskId: Scalars['ID'];
};


export type MutationCreateTagArgs = {
  input: CreateTagInput;
};


export type MutationCreateTagGroupArgs = {
  input: CreateTagGroupInput;
};


export type MutationCreateTaskArgs = {
  input: TaskInput;
  memberIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  picIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};


export type MutationCreateTaskBoardArgs = {
  input: TaskBoardInput;
};


export type MutationCreateTaskBoardFolderArgs = {
  input: CreateTaskBoardFolderInput;
};


export type MutationCreateTaskBoardTeamArgs = {
  input: TaskBoardTeamInput;
};


export type MutationCreateTaskTemplateArgs = {
  input: CreateTaskTemplateInput;
};


export type MutationCreateTimesheetApprovalsArgs = {
  input: CreateTimesheetApprovalsInput;
};


export type MutationCreateTimesheetEntryArgs = {
  input: TimesheetEntryInput;
  locationId?: InputMaybe<Scalars['ID']>;
  memberId: Scalars['ID'];
  taskId: Scalars['ID'];
};


export type MutationCreateWorkspaceArgs = {
  input: CreateWorkspaceInput;
};


export type MutationDeactivateCollectionsArgs = {
  collectionIds: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationDeactivatePublicHolidayArgs = {
  companyId: Scalars['ID'];
  publicHolidayId: Scalars['ID'];
};


export type MutationDeleteBillingInvoiceItemsArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteBillingInvoicesArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteChecklistsArgs = {
  checklistIds: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationDeleteCollectionTagsArgs = {
  input: CollectionTagOptions;
};


export type MutationDeleteCollectionsArgs = {
  collectionIds: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationDeleteCollectorsArgs = {
  input: DeleteCollectorInput;
};


export type MutationDeleteCompanyArgs = {
  companyId: Scalars['ID'];
};


export type MutationDeleteCompanyHolidayArgs = {
  companyHolidayId: Scalars['ID'];
  companyId: Scalars['ID'];
};


export type MutationDeleteCompanyPaymentMethodArgs = {
  input: DeleteCompanyPaymentMethodInput;
};


export type MutationDeleteCompanyTeamArgs = {
  teamId: Scalars['ID'];
};


export type MutationDeleteCompanyTeamStatusArgs = {
  companyTeamStatusId: Scalars['ID'];
};


export type MutationDeleteContactGroupArgs = {
  groupId: Scalars['ID'];
};


export type MutationDeleteContactNotesArgs = {
  contactNoteIds: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationDeleteContactPicArgs = {
  companyId: Scalars['ID'];
  picId: Scalars['ID'];
};


export type MutationDeleteContactTagsArgs = {
  input: ContactTagOptions;
};


export type MutationDeleteContactsArgs = {
  companyId: Scalars['ID'];
  contactIds: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationDeleteCustomColumnForGroupArgs = {
  input: DeleteCustomColumnForGroupInput;
};


export type MutationDeleteCustomTimesheetApprovalsArgs = {
  input: DeleteCustomTimesheetApprovalsInput;
};


export type MutationDeleteCustomValueFromTaskArgs = {
  input: DeleteCustomValueFromTaskInput;
};


export type MutationDeleteLocationsArgs = {
  locationIds: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationDeletePaymentProofArgs = {
  input: DeletePaymentProofInput;
};


export type MutationDeleteProjectClaimsArgs = {
  input: ProjectClaimDeleteInput;
};


export type MutationDeleteProjectGroupsArgs = {
  input: DeleteProjectGroupInput;
};


export type MutationDeleteProjectInvoicesArgs = {
  input: ProjectInvoiceDeleteInput;
};


export type MutationDeleteProjectStatusesArgs = {
  input: DeleteProjectStatusInput;
};


export type MutationDeleteProjectTemplateStatusesArgs = {
  input: ProjectTemplateStatusIdsInput;
};


export type MutationDeleteProjectTemplatesArgs = {
  input: DeleteProjectTemplateIdsInput;
};


export type MutationDeleteProjectTimeCostsArgs = {
  input: ProjectTimeCostDeleteInput;
};


export type MutationDeleteProjectsArgs = {
  input: DeleteProjectsInput;
};


export type MutationDeleteSubscriptionProductArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSubtasksArgs = {
  subtaskIds: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationDeleteTagArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTagGroupArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTaskAttachmentsArgs = {
  taskAttachmentIds: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationDeleteTaskBoardFolderArgs = {
  folderId: Scalars['ID'];
};


export type MutationDeleteTaskBoardTeamsArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
  isV3?: InputMaybe<Scalars['Boolean']>;
};


export type MutationDeleteTaskBoardsArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationDeleteTaskCommentArgs = {
  taskCommentId: Scalars['ID'];
};


export type MutationDeleteTaskMembersArgs = {
  input: TaskMemberInput;
  taskId: Scalars['ID'];
};


export type MutationDeleteTaskPicsArgs = {
  input: TaskPicInput;
  taskId: Scalars['ID'];
};


export type MutationDeleteTaskTagsArgs = {
  input: TaskTagOptions;
};


export type MutationDeleteTaskTemplateArgs = {
  input: DeleteTemplateInput;
};


export type MutationDeleteTasksArgs = {
  taskIds: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationDeleteWorkspacesArgs = {
  input: DeleteWorkspacesInput;
};


export type MutationDetachPaymentMethodArgs = {
  companyId: Scalars['String'];
  paymentMethodId: Scalars['String'];
};


export type MutationDowngradeSubscriptionArgs = {
  input: DowngradeSubscriptionInput;
};


export type MutationDuplicateTasksArgs = {
  input: DuplicateTasksInput;
};


export type MutationEditCustomColumnForGroupArgs = {
  input: EditCustomColumnForGroupInput;
};


export type MutationEditPackageQuantityArgs = {
  companyId: Scalars['ID'];
  companySubscriptionId: Scalars['ID'];
  quantity: Scalars['Int'];
};


export type MutationEditProjectClaimArgs = {
  input: ProjectClaimEditInput;
};


export type MutationEditProjectGroupArgs = {
  input: EditProjectGroupInput;
};


export type MutationEditProjectInvoiceArgs = {
  input: ProjectInvoiceEditInput;
};


export type MutationEditProjectSettingsArgs = {
  input: ProjectSettingsEditInput;
};


export type MutationEditProjectStatusArgs = {
  input: ProjectStatusEditInput;
};


export type MutationEditProjectTemplateArgs = {
  input: ProjectTemplateEditInput;
};


export type MutationEditProjectTemplateStatusArgs = {
  input: ProjectTemplateStatusEditInput;
};


export type MutationEditProjectTimeCostArgs = {
  input: ProjectTimeCostEditInput;
};


export type MutationEditTaskCommentArgs = {
  input: EditTaskCommentInput;
};


export type MutationImportTasksArgs = {
  input: ImportTasksInput;
};


export type MutationLinkAttachmentToCommentArgs = {
  input: LinkAttachmentToCommentInput;
};


export type MutationLinkExternalAttachmentsArgs = {
  input: LinkExternalAttachmentsInput;
};


export type MutationMoveProjectsToWorkspaceArgs = {
  input: MoveProjectsToWorkspaceInput;
};


export type MutationMoveTaskToMemberArgs = {
  input: MoveTaskToMemberInput;
};


export type MutationMoveTasksArgs = {
  input: MoveTasksInput;
};


export type MutationPostTaskCommentArgs = {
  input: PostCommentInput;
};


export type MutationReceivePaymentInvoiceArgs = {
  input: ReceivePaymentInvoiceInput;
};


export type MutationRemoveExpoPushTokenArgs = {
  token: Scalars['String'];
};


export type MutationRemoveFromTaskVisibilityWhitelistArgs = {
  input: RemoveFromTaskVisibilityWhitelistInput;
};


export type MutationRemoveFromVisibilityWhitelistArgs = {
  input: RemoveFromVisibilityWhitelistInput;
};


export type MutationRemoveFromVisibilityWhitelistProjectArgs = {
  input: RemoveFromProjectVisibilityWhitelistInput;
};


export type MutationRemoveFromWorkspaceVisibilityWhitelistArgs = {
  input: RemoveFromWorkspaceVisibilityWhitelistInput;
};


export type MutationRemoveMemberFromCompanyArgs = {
  companyId: Scalars['ID'];
  companyMemberId: Scalars['ID'];
};


export type MutationRemoveMemberFromCompanyTeamArgs = {
  companyTeamId: Scalars['ID'];
  teamMemberId: Scalars['ID'];
};


export type MutationRemoveMemberFromContactGroupArgs = {
  contactId: Scalars['ID'];
  groupId: Scalars['ID'];
};


export type MutationRemoveMembersFromCollectionArgs = {
  input: RemoveMembersFromCollectionInput;
};


export type MutationRemovePackagesFromSubscriptionArgs = {
  companyId: Scalars['ID'];
  companySubscriptionIds: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationRemoveProjectsFromWorkspaceArgs = {
  input: RemoveProjectsFromWorkspaceInput;
};


export type MutationRemoveSenangPayUsersArgs = {
  companyId: Scalars['ID'];
  userIds: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationRemoveSubscriptionProductFromPackageArgs = {
  input: UpdateSubscriptionPackageProductsInput;
};


export type MutationRemoveSubscriptionQuantityFromMemberArgs = {
  companyMemberId: Scalars['ID'];
  stripeProductId: Scalars['String'];
};


export type MutationRemoveTaskBoardsFromFolderArgs = {
  input: RemoveTaskBoardsFromFolderInput;
};


export type MutationRemoveTaskPicsArgs = {
  input: TaskPicsInput;
};


export type MutationRemoveTaskWatchersArgs = {
  input: RemoveTaskWatchersInput;
};


export type MutationReorderGroupsArgs = {
  input: ReorderGroupInput;
};


export type MutationRequestAccountDeletionArgs = {
  input: RequestAccountDeletionInput;
};


export type MutationRequestDedocoSubscriptionArgs = {
  companyId: Scalars['ID'];
  packagePriceId: Scalars['ID'];
};


export type MutationRequestOmniSubscriptionArgs = {
  companyId: Scalars['ID'];
  createSubscriptionInput: Array<InputMaybe<CreateSubscriptionInput>>;
  promoCode?: InputMaybe<Scalars['String']>;
};


export type MutationRequestSubscriptionArgs = {
  companyId: Scalars['ID'];
  packagePriceId: Scalars['ID'];
  promoCode?: InputMaybe<Scalars['String']>;
};


export type MutationRequestTrialOmniSubscriptionArgs = {
  companyId: Scalars['ID'];
  createSubscriptionInput: Array<InputMaybe<CreateSubscriptionInput>>;
  trialDays: Scalars['Int'];
};


export type MutationResendCollectionNotificationArgs = {
  collectionId: Scalars['ID'];
};


export type MutationSendInvoiceArgs = {
  input: SendInvoiceInput;
};


export type MutationSetAttendanceVerificationImageArgs = {
  attendanceId: Scalars['ID'];
  companyMemberId: Scalars['ID'];
  input: SetAttendanceVerificationImageInput;
};


export type MutationSetCompanyMemberReferenceImageArgs = {
  companyMemberId: Scalars['ID'];
  input: UploadMemberReferenceImageInput;
};


export type MutationSetCompanyMemberReferenceImageStatusArgs = {
  companyId: Scalars['ID'];
  companyMemberIds: Array<InputMaybe<Scalars['ID']>>;
  remark?: InputMaybe<Scalars['String']>;
  status: CompanyMemberReferenceImageStatus;
};


export type MutationSetDefaultCompanyArgs = {
  companyId?: InputMaybe<Scalars['ID']>;
};


export type MutationSetDefaultCompanyPaymentMethodArgs = {
  input: SetDefaultCompanyPaymentMethodInput;
};


export type MutationSetDefaultUserTimezoneArgs = {
  timezone: Scalars['String'];
};


export type MutationSetProjectVisibilityArgs = {
  input: SetProjectVisibilityInput;
};


export type MutationSetTaskBoardVisibilityArgs = {
  input: SetTaskBoardVisibilityInput;
};


export type MutationSetTaskVisibilityArgs = {
  input: SetTaskVisibilityInput;
};


export type MutationSetWorkspaceVisibilityArgs = {
  input: SetWorkspaceVisibilityInput;
};


export type MutationStartAttendanceEntryArgs = {
  companyMemberId: Scalars['ID'];
  contactId?: InputMaybe<Scalars['ID']>;
  input: StartAttendanceEntryInput;
  labelId?: InputMaybe<Scalars['ID']>;
  locationId?: InputMaybe<Scalars['ID']>;
};


export type MutationStartSubscriptionArgs = {
  input: StartSubscriptionInput;
};


export type MutationStartTaskTimerArgs = {
  companyMemberId: Scalars['ID'];
  taskId: Scalars['ID'];
};


export type MutationStopMemberActivityTrackerArgs = {
  memberId: Scalars['ID'];
};


export type MutationStopTaskTimerArgs = {
  companyMemberId: Scalars['ID'];
  taskId: Scalars['ID'];
};


export type MutationSwitchSubscriptionPackageArgs = {
  companyId: Scalars['ID'];
  companySubscriptionId: Scalars['ID'];
  switchSubscriptionPackageInput: SwitchSubscriptionPackageInput;
};


export type MutationToggleEnabledCustomColumnArgs = {
  input: ToggleEnabledCustomColumnInput;
};


export type MutationToggleTaskBoardPinnedArgs = {
  boardId: Scalars['ID'];
};


export type MutationToggleTaskBoardsPinnedArgs = {
  boardIds: Array<Scalars['ID']>;
};


export type MutationToggleTasksPinnedArgs = {
  taskIds: Array<Scalars['ID']>;
};


export type MutationToggleTasksPublishStatusArgs = {
  taskIds: Array<Scalars['ID']>;
};


export type MutationUnarchiveCollectionsArgs = {
  collectionIds: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationUnarchiveTasksArgs = {
  input: UnarchiveTaskInput;
};


export type MutationUnlinkAttachmentFromCommentArgs = {
  input: LinkAttachmentToCommentInput;
};


export type MutationUpdateAllReadArgs = {
  companyId?: InputMaybe<Scalars['ID']>;
};


export type MutationUpdateAttendanceLabelArgs = {
  input: AttendanceLabelInput;
  labelId: Scalars['ID'];
};


export type MutationUpdateAttendanceSettingsArgs = {
  companyId: Scalars['ID'];
  input: UpdateAttendanceSettingsInput;
};


export type MutationUpdateBillingInvoiceArgs = {
  input: UpdateBillingInvoiceInput;
};


export type MutationUpdateBillingInvoiceItemArgs = {
  input: UpdateBillingInvoiceItemInput;
};


export type MutationUpdateChecklistArgs = {
  checklistId: Scalars['ID'];
  input: ChecklistUpdateInput;
};


export type MutationUpdateChecklistSequencesArgs = {
  input?: InputMaybe<Array<InputMaybe<ChecklistSequencesInput>>>;
};


export type MutationUpdateCollectionArgs = {
  attachment?: InputMaybe<Scalars['Upload']>;
  collectionId: Scalars['ID'];
  input: UpdateCollectionInput;
  remindOnDays?: InputMaybe<Array<Scalars['Int']>>;
};


export type MutationUpdateCollectionPaymentTypeArgs = {
  collectionId: Scalars['ID'];
  input: UpdateCollectionPaymentTypeInput;
};


export type MutationUpdateCollectionPeriodStatusArgs = {
  collectionId: Scalars['ID'];
  collectionPeriodId: Scalars['ID'];
  status: CollectionPeriodStatusTypes;
};


export type MutationUpdateCollectorArgs = {
  input: UpdateCollectorInput;
};


export type MutationUpdateCompanyHolidayArgs = {
  companyHolidayId: Scalars['ID'];
  companyId: Scalars['ID'];
  input: UpdateCompanyHolidayInput;
};


export type MutationUpdateCompanyInfoArgs = {
  companyId: Scalars['ID'];
  input: UpdateCompanyInfoInput;
};


export type MutationUpdateCompanyMemberActiveStatusArgs = {
  active: Scalars['Boolean'];
  companyMemberId: Scalars['ID'];
};


export type MutationUpdateCompanyMemberInfoArgs = {
  companyMemberId: Scalars['ID'];
  input: UpdateCompanyMemberInfoInput;
};


export type MutationUpdateCompanyProfileArgs = {
  companyId: Scalars['ID'];
  key: Scalars['String'];
  value: Scalars['String'];
};


export type MutationUpdateCompanyTeamInfoArgs = {
  companyTeamId: Scalars['ID'];
  input: UpdateCompanyTeamInfoInput;
};


export type MutationUpdateCompanyTeamStatusArgs = {
  input: UpdateCompanyTeamStatusInput;
  statusId: Scalars['ID'];
  teamId: Scalars['ID'];
};


export type MutationUpdateCompanyTeamStatusSequencesArgs = {
  input: Array<InputMaybe<CompanyTeamStatusSequenceInput>>;
};


export type MutationUpdateCompanyTimezoneArgs = {
  companyId: Scalars['ID'];
  timezone: Scalars['String'];
};


export type MutationUpdateCompanyWorkDaySettingArgs = {
  companyId: Scalars['ID'];
  day: WorkDay;
  employeeTypeId: Scalars['ID'];
  input: UpdateCompanyWorkDayInput;
};


export type MutationUpdateContactArgs = {
  companyId: Scalars['ID'];
  contactGroupId?: InputMaybe<Scalars['ID']>;
  contactId: Scalars['ID'];
  dealCreator?: InputMaybe<Scalars['ID']>;
  input: UpdateContactInput;
};


export type MutationUpdateContactGroupArgs = {
  groupId: Scalars['ID'];
  input: UpdateContactGroupInput;
};


export type MutationUpdateContactNoteArgs = {
  contactNoteId: Scalars['ID'];
  input: ContactNoteInput;
};


export type MutationUpdateContactPicArgs = {
  companyId: Scalars['ID'];
  input: UpdateContactPicInput;
  picId: Scalars['ID'];
};


export type MutationUpdateCustomTimesheetApprovalsArgs = {
  input: UpdateCustomTimesheetApprovalInput;
};


export type MutationUpdateEmployeeTypeArgs = {
  archived?: InputMaybe<CompanyArchivedUpdate>;
  name: Scalars['String'];
  overtime: Scalars['Boolean'];
  typeId: Scalars['ID'];
};


export type MutationUpdateIsReadArgs = {
  notificationIds: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationUpdateLocationArgs = {
  input: UpdateLocationInput;
  locationId: Scalars['ID'];
};


export type MutationUpdateLocationArchivedStatusArgs = {
  archived: Scalars['Boolean'];
  locationIds: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationUpdatePaymentMethodIdArgs = {
  paymentMethodId: Scalars['String'];
};


export type MutationUpdatePaymentStatusArgs = {
  input: UpdatePaymentStatusInput;
};


export type MutationUpdatePersonalTaskArgs = {
  input: PersonalTaskUpdateInput;
  taskId: Scalars['ID'];
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUpdateProjectArgs = {
  input: ProjectUpdateInput;
};


export type MutationUpdateProjectsArchivedStateArgs = {
  input: UpdateProjectsArchivedStateInput;
};


export type MutationUpdateSenangPayOptionsArgs = {
  companyId: Scalars['ID'];
  defaultPayment?: InputMaybe<Scalars['Boolean']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  fullOption?: InputMaybe<Scalars['Boolean']>;
  instalmentOption?: InputMaybe<Scalars['Boolean']>;
};


export type MutationUpdateSubscriptionProductArgs = {
  id: Scalars['ID'];
  input: UpdateSubscriptionProductInput;
};


export type MutationUpdateSubtaskArgs = {
  input: SubtaskUpdateInput;
  subtaskId: Scalars['ID'];
};


export type MutationUpdateSubtaskSequencesArgs = {
  input?: InputMaybe<Array<InputMaybe<SubtaskSequencesInput>>>;
};


export type MutationUpdateTagArgs = {
  input: UpdateTagInput;
};


export type MutationUpdateTagGroupArgs = {
  input: UpdateTagGroupInput;
};


export type MutationUpdateTaskArgs = {
  input: TaskUpdateInput;
  taskId: Scalars['ID'];
};


export type MutationUpdateTaskBoardArgs = {
  id: Scalars['ID'];
  input: TaskBoardUpdateInput;
};


export type MutationUpdateTaskBoardFolderArgs = {
  input: UpdateTaskBoardFolderInput;
};


export type MutationUpdateTaskBoardsArchivedStateArgs = {
  input: UpdateTaskBoardsArchivedStateInput;
};


export type MutationUpdateTaskCommentArgs = {
  input: TaskCommentUpdateInput;
  taskCommentId: Scalars['ID'];
};


export type MutationUpdateTaskParentArgs = {
  input: UpdateTaskParentInput;
};


export type MutationUpdateTaskTemplateArgs = {
  input: UpdateTaskTemplateInput;
};


export type MutationUpdateTasksSequenceArgs = {
  input: Array<InputMaybe<TaskSequenceInput>>;
};


export type MutationUpdateTimeSheetArchivedStatusArgs = {
  archived: TimesheetArchiveStatus;
  timesheetIds: Array<Scalars['ID']>;
};


export type MutationUpdateTimesheetArgs = {
  input: UpdateTimesheetInput;
  locationId?: InputMaybe<Scalars['ID']>;
  timesheetId: Scalars['ID'];
};


export type MutationUpdateTimesheetApprovalsArgs = {
  input: UpdateTimesheetApprovalInput;
};


export type MutationUpdateToolTipsStatusArgs = {
  input: UpdateToolTipsStatusInput;
};


export type MutationUpdateUserOnboardingArgs = {
  payload?: InputMaybe<Scalars['JSON']>;
};


export type MutationUpdateUserViewOptionsArgs = {
  payload?: InputMaybe<Scalars['JSON']>;
};


export type MutationUpdateWorkspaceArgs = {
  input: UpdateWorkspaceInput;
};


export type MutationUpgradeSubscriptionArgs = {
  input: UpgradeSubscriptionInput;
};


export type MutationUploadCompanyProfileImageArgs = {
  attachment: Scalars['Upload'];
  companyId: Scalars['ID'];
};


export type MutationUploadPaymentProofArgs = {
  attachment: Scalars['Upload'];
  input: CreateCollectionPaymentInput;
};


export type MutationUploadPaymentReceiptArgs = {
  attachment: Scalars['Upload'];
  input: UploadPaymentReceiptInput;
};


export type MutationUploadProfileImageArgs = {
  attachment: Scalars['Upload'];
};


export type MutationUploadTaskAttachmentArgs = {
  attachment: Scalars['Upload'];
  commentId?: InputMaybe<Scalars['ID']>;
  taskId: Scalars['ID'];
};


export type MutationVoidInvoiceArgs = {
  input: VoidInvoiceInput;
};

export type Notification = {
  __typename?: 'Notification';
  collection?: Maybe<Collection>;
  comment?: Maybe<TaskComment>;
  company?: Maybe<Company>;
  contact?: Maybe<Contact>;
  created_at?: Maybe<Scalars['DateTime']>;
  data?: Maybe<Scalars['String']>;
  deleted_at?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  due_date?: Maybe<Scalars['DateTime']>;
  group?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  member?: Maybe<CompanyMember>;
  message?: Maybe<Scalars['String']>;
  pic?: Maybe<ContactPic>;
  task?: Maybe<Task>;
  taskBoard?: Maybe<TaskBoard>;
  team?: Maybe<CompanyTeam>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['DateTime']>;
  user?: Maybe<User>;
};

export enum NotificationGroups {
  Collection = 'COLLECTION',
  Crm = 'CRM',
  Misc = 'MISC',
  Payment = 'PAYMENT',
  Task = 'TASK'
}

export enum NotificationType {
  AssignedAsCreator = 'ASSIGNED_AS_CREATOR',
  AssignedMemberType = 'ASSIGNED_MEMBER_TYPE',
  AssignedToTeam = 'ASSIGNED_TO_TEAM',
  ClockInAfterTenMinutes = 'CLOCK_IN_AFTER_TEN_MINUTES',
  ClockInBeforeTenMinutes = 'CLOCK_IN_BEFORE_TEN_MINUTES',
  ClockOutAfterTwoHours = 'CLOCK_OUT_AFTER_TWO_HOURS',
  CollectionCancelled = 'COLLECTION_CANCELLED',
  CollectionCreated = 'COLLECTION_CREATED',
  CollectionDue = 'COLLECTION_DUE',
  CollectionOverdue = 'COLLECTION_OVERDUE',
  CollectionPaymentReceived = 'COLLECTION_PAYMENT_RECEIVED',
  CollectionPaymentRejected = 'COLLECTION_PAYMENT_REJECTED',
  CommentOnTask = 'COMMENT_ON_TASK',
  DedocoSignRequest = 'DEDOCO_SIGN_REQUEST',
  FpxTransactionStatus = 'FPX_TRANSACTION_STATUS',
  Generic = 'GENERIC',
  InvitedToCompany = 'INVITED_TO_COMPANY',
  JoinCompanyByCode = 'JOIN_COMPANY_BY_CODE',
  MemberAssignedToTask = 'MEMBER_ASSIGNED_TO_TASK',
  MemberAssignedToTaskboard = 'MEMBER_ASSIGNED_TO_TASKBOARD',
  MemberRemovedFromTask = 'MEMBER_REMOVED_FROM_TASK',
  MemberRemovedFromTaskboard = 'MEMBER_REMOVED_FROM_TASKBOARD',
  PicAssignedToTask = 'PIC_ASSIGNED_TO_TASK',
  PicAssignedToTaskboard = 'PIC_ASSIGNED_TO_TASKBOARD',
  PicRemovedFromTask = 'PIC_REMOVED_FROM_TASK',
  PicRemovedFromTaskboard = 'PIC_REMOVED_FROM_TASKBOARD',
  ProjectOnDue = 'PROJECT_ON_DUE',
  ProjectOverdue = 'PROJECT_OVERDUE',
  ProjectReminder = 'PROJECT_REMINDER',
  QuotaExceeded = 'QUOTA_EXCEEDED',
  RemovedFromCompany = 'REMOVED_FROM_COMPANY',
  RemovedFromTeam = 'REMOVED_FROM_TEAM',
  SenangpayActivation = 'SENANGPAY_ACTIVATION',
  SenangpayTransactionFull = 'SENANGPAY_TRANSACTION_FULL',
  SenangpayTransactionRecurring = 'SENANGPAY_TRANSACTION_RECURRING',
  TaskDone = 'TASK_DONE',
  TaskDueMember = 'TASK_DUE_MEMBER',
  TaskDuePic = 'TASK_DUE_PIC',
  TaskOverdueMember = 'TASK_OVERDUE_MEMBER',
  TaskOverduePic = 'TASK_OVERDUE_PIC',
  TaskRejected = 'TASK_REJECTED',
  UploadToTask = 'UPLOAD_TO_TASK'
}

export type NotificationTypeInput = {
  isAssigned?: InputMaybe<Scalars['Boolean']>;
  isMentioned?: InputMaybe<Scalars['Boolean']>;
  isUnread?: InputMaybe<Scalars['Boolean']>;
};

export enum PackageTypes {
  Basic = 'BASIC',
  Dedoco = 'DEDOCO',
  Legacy = 'LEGACY',
  PaymentCollectionReminder = 'PAYMENT_COLLECTION_REMINDER',
  ProjectManagementTool = 'PROJECT_MANAGEMENT_TOOL',
  TimeAttendance = 'TIME_ATTENDANCE'
}

export type PaginatedProjectClaims = {
  __typename?: 'PaginatedProjectClaims';
  projectClaims?: Maybe<Array<Maybe<ProjectClaim>>>;
  total?: Maybe<Scalars['Int']>;
};

export type PaginatedProjectInvoices = {
  __typename?: 'PaginatedProjectInvoices';
  projectInvoices?: Maybe<Array<Maybe<ProjectInvoice>>>;
  total?: Maybe<Scalars['Int']>;
};

export type PaginatedProjectTimeCosts = {
  __typename?: 'PaginatedProjectTimeCosts';
  projectTimeCosts?: Maybe<Array<Maybe<ProjectTimeCost>>>;
  total?: Maybe<Scalars['Int']>;
};

export type PaginatedSharedWithMeTasks = {
  __typename?: 'PaginatedSharedWithMeTasks';
  tasks?: Maybe<Array<Maybe<Task>>>;
  total?: Maybe<Scalars['Int']>;
};

export type PaginatedTaskBoards = {
  __typename?: 'PaginatedTaskBoards';
  taskBoards?: Maybe<Array<Maybe<TaskBoard>>>;
  total?: Maybe<Scalars['Int']>;
};

export type PaginatedTasks = {
  __typename?: 'PaginatedTasks';
  tasks?: Maybe<Array<Maybe<Task>>>;
  total?: Maybe<Scalars['Int']>;
};

export type Pagination = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<SortDirection>;
};

export type PaginationFilter = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
};

export type PaymentMethod = {
  __typename?: 'PaymentMethod';
  card?: Maybe<PaymentMethodCard>;
  created?: Maybe<Scalars['Int']>;
  customer?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  type?: Maybe<Scalars['String']>;
};

export type PaymentMethodCard = {
  __typename?: 'PaymentMethodCard';
  brand?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  expMonth?: Maybe<Scalars['Int']>;
  expYear?: Maybe<Scalars['Int']>;
  exp_month?: Maybe<Scalars['Int']>;
  exp_year?: Maybe<Scalars['Int']>;
  last4?: Maybe<Scalars['String']>;
};

export enum PersonalStatusType {
  Closed = 'CLOSED',
  Fail = 'FAIL',
  Pass = 'PASS',
  Pending = 'PENDING'
}

export type PersonalTaskUpdateInput = {
  description?: InputMaybe<Scalars['String']>;
  dueDate?: InputMaybe<Scalars['DateTime']>;
  dueReminder?: InputMaybe<Scalars['DateTime']>;
  due_date?: InputMaybe<Scalars['DateTime']>;
  due_reminder?: InputMaybe<Scalars['DateTime']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  end_date?: InputMaybe<Scalars['DateTime']>;
  name?: InputMaybe<Scalars['String']>;
  sequence?: InputMaybe<Scalars['Int']>;
  stageStatus?: InputMaybe<StageType>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  start_date?: InputMaybe<Scalars['DateTime']>;
  status?: InputMaybe<PersonalStatusType>;
  teamId?: InputMaybe<Scalars['ID']>;
  team_id?: InputMaybe<Scalars['ID']>;
  value?: InputMaybe<Scalars['Float']>;
};

export type PostCommentInput = {
  messageContent: Scalars['String'];
  /** In JSON Format */
  parentId?: InputMaybe<Scalars['String']>;
  taskId: Scalars['ID'];
};

export type ProductInCoupon = {
  __typename?: 'ProductInCoupon';
  products?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type ProjectClaim = {
  __typename?: 'ProjectClaim';
  amount?: Maybe<Scalars['Float']>;
  attachmentUrl?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  member?: Maybe<CompanyMember>;
  name?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  project?: Maybe<TaskBoard>;
  status?: Maybe<ProjectClaimType>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
};

export type ProjectClaimDeleteInput = {
  ids: Array<Scalars['ID']>;
};

export type ProjectClaimEditInput = {
  amount?: InputMaybe<Scalars['Float']>;
  attachmentUrl?: InputMaybe<Scalars['String']>;
  claimId: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  memberId?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  note?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<ProjectClaimType>;
};

export type ProjectClaimFilter = {
  projectId?: InputMaybe<Scalars['ID']>;
};

export type ProjectClaimInput = {
  amount: Scalars['Float'];
  attachmentUrl?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  memberId?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  note?: InputMaybe<Scalars['String']>;
  projectId: Scalars['ID'];
  status?: InputMaybe<ProjectClaimType>;
};

export type ProjectClaimSort = {
  direction?: InputMaybe<SortDirection>;
  type?: InputMaybe<ProjectClaimSortType>;
};

export enum ProjectClaimSortType {
  CreatedAt = 'CREATED_AT',
  Name = 'NAME'
}

export enum ProjectClaimType {
  Approved = 'APPROVED',
  New = 'NEW',
  Rejected = 'REJECTED'
}

export type ProjectGroup = {
  __typename?: 'ProjectGroup';
  customColumns?: Maybe<Array<Maybe<ProjectGroupCustomColumn>>>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  ordering?: Maybe<Scalars['Int']>;
  project?: Maybe<TaskBoard>;
  tasks?: Maybe<Array<Maybe<Task>>>;
};

export type ProjectGroupCustomAttribute = {
  __typename?: 'ProjectGroupCustomAttribute';
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<ProjectGroupCustomAttributeType>;
};

export enum ProjectGroupCustomAttributeType {
  Number = 'NUMBER',
  Text = 'TEXT'
}

export type ProjectGroupCustomColumn = {
  __typename?: 'ProjectGroupCustomColumn';
  attribute?: Maybe<ProjectGroupCustomAttribute>;
  enabled?: Maybe<Scalars['Boolean']>;
  group?: Maybe<ProjectGroup>;
};

export type ProjectInvoice = {
  __typename?: 'ProjectInvoice';
  actualCost?: Maybe<Scalars['Float']>;
  amount?: Maybe<Scalars['Float']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  id?: Maybe<Scalars['ID']>;
  invoiceNo?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  project?: Maybe<TaskBoard>;
  quantity?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  variance?: Maybe<Scalars['Float']>;
};

export type ProjectInvoiceDeleteInput = {
  ids: Array<Scalars['ID']>;
};

export type ProjectInvoiceEditInput = {
  actualCost?: InputMaybe<Scalars['Float']>;
  invoiceId: Scalars['ID'];
  invoiceNo?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['Float']>;
  quantity?: InputMaybe<Scalars['Int']>;
};

export type ProjectInvoiceFilter = {
  projectId?: InputMaybe<Scalars['ID']>;
};

export type ProjectInvoiceInput = {
  actualCost?: InputMaybe<Scalars['Float']>;
  invoiceNo?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  price: Scalars['Float'];
  projectId: Scalars['ID'];
  quantity: Scalars['Int'];
};

export type ProjectInvoiceSort = {
  direction?: InputMaybe<SortDirection>;
  type?: InputMaybe<ProjectInvoiceSortType>;
};

export enum ProjectInvoiceSortType {
  CreatedAt = 'CREATED_AT',
  Name = 'NAME'
}

export type ProjectSettings = {
  __typename?: 'ProjectSettings';
  columns?: Maybe<Scalars['JSON']>;
  project?: Maybe<TaskBoard>;
};

export type ProjectSettingsEditInput = {
  columns: ProjectTemplateOptions;
  projectId: Scalars['ID'];
};

export type ProjectStatus = {
  __typename?: 'ProjectStatus';
  color?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  notify?: Maybe<Scalars['Boolean']>;
  project?: Maybe<TaskBoard>;
  sequence?: Maybe<Scalars['Int']>;
};

export type ProjectStatusEditInput = {
  color?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  notify?: InputMaybe<Scalars['Boolean']>;
  projectStatusId: Scalars['ID'];
  sequence?: InputMaybe<Scalars['Int']>;
};

export type ProjectTemplate = {
  __typename?: 'ProjectTemplate';
  columns?: Maybe<Scalars['JSON']>;
  company?: Maybe<Company>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  statuses?: Maybe<Array<Maybe<ProjectTemplateStatus>>>;
};

export type ProjectTemplateEditInput = {
  columns?: InputMaybe<ProjectTemplateOptions>;
  name?: InputMaybe<Scalars['String']>;
  projectTemplateId: Scalars['ID'];
};

export type ProjectTemplateGallery = {
  __typename?: 'ProjectTemplateGallery';
  galleryTemplates?: Maybe<Scalars['JSON']>;
};

export type ProjectTemplateInput = {
  columns?: InputMaybe<ProjectTemplateOptions>;
  companyId: Scalars['ID'];
  name: Scalars['String'];
  statuses?: InputMaybe<Array<InputMaybe<ProjectTemplateStatusInput>>>;
};

export type ProjectTemplateOptions = {
  activity?: InputMaybe<Scalars['Boolean']>;
  assignee?: InputMaybe<Scalars['Boolean']>;
  contacts?: InputMaybe<Scalars['Boolean']>;
  effort?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['Boolean']>;
  priority?: InputMaybe<Scalars['Boolean']>;
  recurrence?: InputMaybe<Scalars['Boolean']>;
  reminder?: InputMaybe<Scalars['Boolean']>;
  status?: InputMaybe<Scalars['Boolean']>;
  tags?: InputMaybe<Scalars['Boolean']>;
  timeline?: InputMaybe<Scalars['Boolean']>;
  tracking?: InputMaybe<Scalars['Boolean']>;
  value?: InputMaybe<Scalars['Boolean']>;
  watchers?: InputMaybe<Scalars['Boolean']>;
};

export type ProjectTemplateStatus = {
  __typename?: 'ProjectTemplateStatus';
  color?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  notify?: Maybe<Scalars['Boolean']>;
  projectTemplate?: Maybe<ProjectTemplate>;
};

export type ProjectTemplateStatusEditInput = {
  color?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  notify?: InputMaybe<Scalars['Boolean']>;
  projectTemplateStatusId: Scalars['ID'];
};

export type ProjectTemplateStatusIdsInput = {
  projectTemplateStatusIds: Array<Scalars['ID']>;
};

export type ProjectTemplateStatusInput = {
  color: Scalars['String'];
  name: Scalars['String'];
  notify?: InputMaybe<Scalars['Boolean']>;
};

export type ProjectTimeCost = {
  __typename?: 'ProjectTimeCost';
  amount?: Maybe<Scalars['Float']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  date?: Maybe<Scalars['DateTime']>;
  duration?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['ID']>;
  member?: Maybe<CompanyMember>;
  project?: Maybe<TaskBoard>;
  task?: Maybe<Task>;
  timeIn?: Maybe<Scalars['DateTime']>;
  timeOut?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
};

export type ProjectTimeCostDeleteInput = {
  ids: Array<Scalars['ID']>;
};

export type ProjectTimeCostEditInput = {
  amount?: InputMaybe<Scalars['Float']>;
  date?: InputMaybe<Scalars['DateTime']>;
  memberId?: InputMaybe<Scalars['ID']>;
  note?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['ID']>;
  taskId?: InputMaybe<Scalars['ID']>;
  timeCostId: Scalars['ID'];
  timeIn?: InputMaybe<Scalars['DateTime']>;
  timeOut?: InputMaybe<Scalars['DateTime']>;
};

export type ProjectTimeCostFilter = {
  projectId?: InputMaybe<Scalars['ID']>;
};

export type ProjectTimeCostInput = {
  amount: Scalars['Float'];
  date: Scalars['DateTime'];
  memberId: Scalars['ID'];
  note?: InputMaybe<Scalars['String']>;
  projectId: Scalars['ID'];
  taskId: Scalars['ID'];
  timeIn?: InputMaybe<Scalars['DateTime']>;
  timeOut?: InputMaybe<Scalars['DateTime']>;
};

export type ProjectTimeCostSort = {
  direction?: InputMaybe<SortDirection>;
  type?: InputMaybe<ProjectTimeCostSortType>;
};

export enum ProjectTimeCostSortType {
  CreatedAt = 'CREATED_AT'
}

export type ProjectUpdateInput = {
  color?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  /** "owners" are company member IDs */
  ownerIds?: InputMaybe<Array<Scalars['ID']>>;
  projectId: Scalars['ID'];
  published?: InputMaybe<Scalars['Boolean']>;
};

export enum ProjectVisibility {
  Assigned = 'ASSIGNED',
  Hidden = 'HIDDEN',
  Private = 'PRIVATE',
  Public = 'PUBLIC',
  Specific = 'SPECIFIC'
}

export type PublicHoliday = {
  __typename?: 'PublicHoliday';
  countryCode?: Maybe<Scalars['String']>;
  country_code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  created_at?: Maybe<Scalars['DateTime']>;
  date?: Maybe<Scalars['DateTime']>;
  endDate?: Maybe<Scalars['DateTime']>;
  end_date?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['DateTime']>;
  start_date?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updated_at?: Maybe<Scalars['DateTime']>;
  year?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  /** selectedDate limit will only for one month */
  attendanceDaySummaries?: Maybe<Array<Maybe<AttendanceDaySummary>>>;
  attendanceDaySummary?: Maybe<Array<Maybe<AttendanceDaySummary>>>;
  attendanceLabels?: Maybe<Array<Maybe<AttendanceLabel>>>;
  attendanceMemberStats?: Maybe<AttendanceMemberStats>;
  attendanceMonthSummary?: Maybe<Array<Maybe<AttendanceMonthSummary>>>;
  attendanceSettings?: Maybe<AttendanceSettings>;
  attendanceWeekSummary?: Maybe<Array<Maybe<AttendanceWeekSummary>>>;
  attendanceWeeklyForMonthSummary?: Maybe<Array<Maybe<AttendanceWeekSummary>>>;
  attendances?: Maybe<Array<Maybe<Attendance>>>;
  billingInvoice?: Maybe<BillingInvoice>;
  billingInvoiceItem?: Maybe<BillingInvoiceItem>;
  billingInvoiceItems?: Maybe<Array<Maybe<BillingInvoiceItem>>>;
  billingInvoices?: Maybe<Array<Maybe<BillingInvoice>>>;
  breadcrumbInfo?: Maybe<BreadcrumbInfo>;
  collection?: Maybe<Collection>;
  collectionPeriod?: Maybe<CollectionPeriod>;
  collectionPeriods?: Maybe<Array<Maybe<CollectionPeriod>>>;
  collector?: Maybe<Collector>;
  collectorActivities?: Maybe<Array<Maybe<CollectionActivityLog>>>;
  collectors?: Maybe<Array<Maybe<Collector>>>;
  companies?: Maybe<Array<Maybe<Company>>>;
  company?: Maybe<Company>;
  companyMember?: Maybe<CompanyMember>;
  companyPaymentMethods?: Maybe<Array<Maybe<CompanyPaymentMethod>>>;
  companyProfileJson?: Maybe<Scalars['String']>;
  companySlug?: Maybe<Company>;
  companyStorage?: Maybe<CompanyStorageDetails>;
  /** This query is deprecated. Please use the new query 'subscription' instead. */
  companySubscription?: Maybe<CompanySubscription>;
  companySubscriptions?: Maybe<Array<Maybe<CompanySubscription>>>;
  companyTeam?: Maybe<CompanyTeam>;
  companyTeams?: Maybe<Array<Maybe<CompanyTeam>>>;
  companyWorkDaySettings?: Maybe<Array<Maybe<CompanyWorkDaySetting>>>;
  contact?: Maybe<Contact>;
  contactActivities?: Maybe<Array<Maybe<ContactActivityRaw>>>;
  contactGroup?: Maybe<ContactGroup>;
  contactGroups?: Maybe<Array<Maybe<ContactGroup>>>;
  contacts?: Maybe<Array<Maybe<Contact>>>;
  currentAttendance?: Maybe<Attendance>;
  currentUser?: Maybe<User>;
  customTimesheetApprovals?: Maybe<Array<Maybe<CustomTimesheetDayApproval>>>;
  dedocoPackages?: Maybe<Array<Maybe<SubscriptionPackage>>>;
  employeeType?: Maybe<EmployeeType>;
  filterTimesheet?: Maybe<Array<Maybe<Timesheet>>>;
  getActivityTimeSummaryByDay?: Maybe<Array<Maybe<ActivityDaySummary>>>;
  getActivityTimeSummaryByMonth?: Maybe<Array<Maybe<ActivityMonthSummary>>>;
  getActivityTimeSummaryByWeek?: Maybe<Array<Maybe<ActivityWeekSummary>>>;
  getCollaboratedCollectors?: Maybe<Array<Maybe<Collector>>>;
  getCollector?: Maybe<Collector>;
  getMonthlyActivityTrackingByMonth?: Maybe<Array<Maybe<ActivityWeekSummary>>>;
  getReferenceImageUploadUrl?: Maybe<CompanyMemberReferenceImageResponse>;
  getServerTime?: Maybe<Scalars['DateTime']>;
  /** To be deprecated */
  getTaskPics?: Maybe<Array<Maybe<TaskPic>>>;
  getTimesheetsByCompanyMember?: Maybe<Array<Maybe<Timesheet>>>;
  getVerificationImageUploadUrl?: Maybe<VerificationImageUploadUrlResponse>;
  globalProjectTemplateGallery?: Maybe<ProjectTemplateGallery>;
  holidays?: Maybe<Array<Maybe<Holiday>>>;
  listCollectors?: Maybe<Array<Maybe<Collector>>>;
  location?: Maybe<Location>;
  locations?: Maybe<Array<Maybe<Location>>>;
  me?: Maybe<User>;
  memberLastOut?: Maybe<Attendance>;
  project?: Maybe<TaskBoard>;
  projectClaim?: Maybe<ProjectClaim>;
  projectClaims?: Maybe<PaginatedProjectClaims>;
  projectInvoice?: Maybe<ProjectInvoice>;
  projectInvoices?: Maybe<PaginatedProjectInvoices>;
  projectTemplates?: Maybe<Array<Maybe<ProjectTemplate>>>;
  projectTimeCost?: Maybe<ProjectTimeCost>;
  projectTimeCosts?: Maybe<PaginatedProjectTimeCosts>;
  projects?: Maybe<Array<Maybe<TaskBoard>>>;
  promoCodeInfo?: Maybe<Array<Maybe<DiscountedPrice>>>;
  redisTest?: Maybe<Array<Maybe<Scalars['String']>>>;
  senangPayUsers?: Maybe<Array<Maybe<CompanyMember>>>;
  sharedWithMeTasks?: Maybe<PaginatedSharedWithMeTasks>;
  shortUrl?: Maybe<ShortUrl>;
  /**
   * If you specify an id then it will only return if you are an admin. Otherwise it will return the subscription
   * for the currently active company
   */
  subscription?: Maybe<Subscription>;
  subscriptionPackageV2?: Maybe<SubscriptionPackage>;
  subscriptionPackages?: Maybe<Array<Maybe<SubscriptionPackage>>>;
  subscriptionPackagesV2?: Maybe<Array<Maybe<SubscriptionPackage>>>;
  subscriptionProduct?: Maybe<SubscriptionProduct>;
  subscriptionProducts?: Maybe<Array<Maybe<SubscriptionProduct>>>;
  subscriptionQuantitiesAssigned?: Maybe<SubscriptionQuantityResult>;
  /** This is not implemented yet */
  subscriptions?: Maybe<Array<Maybe<Subscription>>>;
  tag?: Maybe<Tag>;
  tagGroup?: Maybe<TagGroup>;
  tagGroups?: Maybe<Array<Maybe<TagGroup>>>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  task?: Maybe<Task>;
  taskBoard?: Maybe<TaskBoard>;
  taskBoardFolders?: Maybe<Array<Maybe<TaskBoardFolder>>>;
  taskBoardTeams?: Maybe<Array<Maybe<TaskBoardTeam>>>;
  taskBoards?: Maybe<Array<Maybe<TaskBoard>>>;
  taskBoardsV3?: Maybe<PaginatedTaskBoards>;
  taskPics?: Maybe<Array<Maybe<TaskPic>>>;
  taskTemplate?: Maybe<TaskTemplate>;
  taskTemplates?: Maybe<Array<Maybe<TaskTemplate>>>;
  tasks?: Maybe<Array<Maybe<Task>>>;
  tasksV3?: Maybe<PaginatedTasks>;
  teamStatuses?: Maybe<Array<Maybe<CompanyTeamStatus>>>;
  timesheet?: Maybe<Timesheet>;
  timesheetApprovals?: Maybe<Array<Maybe<TimesheetDayApproval>>>;
  timesheets?: Maybe<Array<Maybe<Timesheet>>>;
  user?: Maybe<User>;
  userInvoices?: Maybe<Array<Maybe<StripeInvoice>>>;
  userSubscriptions?: Maybe<Array<Maybe<CompanySubscription>>>;
  workspace?: Maybe<Workspace>;
  workspaces?: Maybe<Array<Maybe<Workspace>>>;
};


export type QueryAttendanceDaySummariesArgs = {
  companyId: Scalars['ID'];
  companyMemberId?: InputMaybe<Scalars['ID']>;
  selectedDate: Scalars['DateTime'];
};


export type QueryAttendanceDaySummaryArgs = {
  companyId: Scalars['ID'];
  input: AttendanceDaySummaryInput;
};


export type QueryAttendanceLabelsArgs = {
  companyId: Scalars['ID'];
};


export type QueryAttendanceMemberStatsArgs = {
  memberId: Scalars['ID'];
};


export type QueryAttendanceMonthSummaryArgs = {
  companyId: Scalars['ID'];
  input: AttendanceMonthSummaryInput;
};


export type QueryAttendanceSettingsArgs = {
  companyId: Scalars['ID'];
};


export type QueryAttendanceWeekSummaryArgs = {
  companyId: Scalars['ID'];
  input: AttendanceWeekSummaryInput;
};


export type QueryAttendanceWeeklyForMonthSummaryArgs = {
  companyId: Scalars['ID'];
  input: AttendanceMonthSummaryInput;
};


export type QueryAttendancesArgs = {
  input: GetAttendancesInput;
};


export type QueryBillingInvoiceArgs = {
  id: Scalars['ID'];
};


export type QueryBillingInvoiceItemArgs = {
  id: Scalars['ID'];
};


export type QueryBillingInvoiceItemsArgs = {
  invoiceId: Scalars['ID'];
};


export type QueryBillingInvoicesArgs = {
  projectId: Scalars['ID'];
};


export type QueryBreadcrumbInfoArgs = {
  id: Scalars['ID'];
  type: BreadcrumbType;
};


export type QueryCollectionArgs = {
  collectionId: Scalars['ID'];
  isForMember?: InputMaybe<Scalars['Boolean']>;
};


export type QueryCollectionPeriodArgs = {
  collectionPeriodId: Scalars['ID'];
};


export type QueryCollectionPeriodsArgs = {
  collectionId: Scalars['ID'];
};


export type QueryCollectorArgs = {
  collectorId: Scalars['ID'];
};


export type QueryCollectorActivitiesArgs = {
  companyId: Scalars['ID'];
};


export type QueryCollectorsArgs = {
  companyId: Scalars['ID'];
};


export type QueryCompaniesArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryCompanyArgs = {
  id: Scalars['ID'];
};


export type QueryCompanyMemberArgs = {
  companyMemberId: Scalars['ID'];
};


export type QueryCompanyPaymentMethodsArgs = {
  companyId: Scalars['ID'];
};


export type QueryCompanyProfileJsonArgs = {
  companyId: Scalars['ID'];
};


export type QueryCompanySlugArgs = {
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryCompanyStorageArgs = {
  companyId: Scalars['ID'];
};


export type QueryCompanySubscriptionArgs = {
  subscriptionId: Scalars['ID'];
};


export type QueryCompanySubscriptionsArgs = {
  companyId: Scalars['ID'];
};


export type QueryCompanyTeamArgs = {
  id: Scalars['ID'];
};


export type QueryCompanyTeamsArgs = {
  companyId: Scalars['ID'];
};


export type QueryCompanyWorkDaySettingsArgs = {
  companyId: Scalars['ID'];
  employeeTypeId: Scalars['ID'];
};


export type QueryContactArgs = {
  id: Scalars['ID'];
};


export type QueryContactActivitiesArgs = {
  contactId: Scalars['ID'];
  isCount: Scalars['Boolean'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  tableType: ContactActivityTableType;
};


export type QueryContactGroupArgs = {
  companyId: Scalars['ID'];
  groupId: Scalars['ID'];
};


export type QueryContactGroupsArgs = {
  companyId: Scalars['ID'];
};


export type QueryContactsArgs = {
  companyId: Scalars['ID'];
};


export type QueryCurrentAttendanceArgs = {
  memberId: Scalars['ID'];
};


export type QueryCustomTimesheetApprovalsArgs = {
  companyId: Scalars['ID'];
  memberId?: InputMaybe<Scalars['ID']>;
};


export type QueryEmployeeTypeArgs = {
  employeeTypeId: Scalars['ID'];
};


export type QueryFilterTimesheetArgs = {
  companyMemberId?: InputMaybe<Scalars['ID']>;
  teamId?: InputMaybe<Scalars['ID']>;
};


export type QueryGetActivityTimeSummaryByDayArgs = {
  companyId: Scalars['ID'];
  filters: DayTimesheetFilterOptions;
};


export type QueryGetActivityTimeSummaryByMonthArgs = {
  companyId: Scalars['ID'];
  filters: MonthlyTimesheetFilterOptions;
};


export type QueryGetActivityTimeSummaryByWeekArgs = {
  companyId: Scalars['ID'];
  filters: WeeklyTimesheetFilterOptions;
};


export type QueryGetCollectorArgs = {
  collectorId: Scalars['ID'];
};


export type QueryGetMonthlyActivityTrackingByMonthArgs = {
  companyId: Scalars['ID'];
  filters: MonthlyTimesheetFilterOptions;
};


export type QueryGetReferenceImageUploadUrlArgs = {
  companyId: Scalars['ID'];
};


export type QueryGetServerTimeArgs = {
  companyId: Scalars['ID'];
};


export type QueryGetTimesheetsByCompanyMemberArgs = {
  companyMemberId: Scalars['ID'];
};


export type QueryGetVerificationImageUploadUrlArgs = {
  companyId: Scalars['ID'];
};


export type QueryHolidaysArgs = {
  companyId: Scalars['ID'];
  year: Scalars['Int'];
};


export type QueryListCollectorsArgs = {
  companyId: Scalars['ID'];
};


export type QueryLocationArgs = {
  id: Scalars['ID'];
};


export type QueryLocationsArgs = {
  companyId: Scalars['ID'];
};


export type QueryMemberLastOutArgs = {
  companyMemberId: Scalars['ID'];
};


export type QueryProjectArgs = {
  id: Scalars['ID'];
};


export type QueryProjectClaimArgs = {
  claimId: Scalars['ID'];
};


export type QueryProjectClaimsArgs = {
  filter?: InputMaybe<ProjectClaimFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<ProjectClaimSort>;
};


export type QueryProjectInvoiceArgs = {
  invoiceId: Scalars['ID'];
};


export type QueryProjectInvoicesArgs = {
  filter?: InputMaybe<ProjectInvoiceFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<ProjectInvoiceSort>;
};


export type QueryProjectTemplatesArgs = {
  companyId: Scalars['ID'];
};


export type QueryProjectTimeCostArgs = {
  timeCostId: Scalars['ID'];
};


export type QueryProjectTimeCostsArgs = {
  filter?: InputMaybe<ProjectClaimFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<ProjectTimeCostSort>;
};


export type QueryProjectsArgs = {
  memberId: Scalars['ID'];
};


export type QueryPromoCodeInfoArgs = {
  code: Scalars['String'];
  createSubscriptionInput: Array<InputMaybe<CreateSubscriptionInput>>;
};


export type QuerySenangPayUsersArgs = {
  companyId: Scalars['ID'];
};


export type QuerySharedWithMeTasksArgs = {
  filter?: InputMaybe<TaskFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<TaskSort>;
};


export type QueryShortUrlArgs = {
  shortId: Scalars['String'];
};


export type QuerySubscriptionArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QuerySubscriptionPackageV2Args = {
  packageId: Scalars['ID'];
};


export type QuerySubscriptionPackagesV2Args = {
  listAll?: InputMaybe<Scalars['Boolean']>;
};


export type QuerySubscriptionProductArgs = {
  productId: Scalars['ID'];
};


export type QuerySubscriptionQuantitiesAssignedArgs = {
  companyId: Scalars['ID'];
  stripeProductId: Scalars['String'];
};


export type QuerySubscriptionsArgs = {
  companyId?: InputMaybe<Scalars['ID']>;
};


export type QueryTagArgs = {
  id: Scalars['ID'];
};


export type QueryTagGroupArgs = {
  id: Scalars['ID'];
};


export type QueryTagGroupsArgs = {
  companyId: Scalars['ID'];
};


export type QueryTagsArgs = {
  companyId: Scalars['ID'];
};


export type QueryTaskArgs = {
  taskId: Scalars['ID'];
};


export type QueryTaskBoardArgs = {
  id: Scalars['ID'];
};


export type QueryTaskBoardFoldersArgs = {
  type: TaskBoardFolderType;
};


export type QueryTaskBoardTeamsArgs = {
  category?: InputMaybe<TaskBoardCategory>;
  companyId: Scalars['ID'];
  type: TaskBoardType;
};


export type QueryTaskBoardsArgs = {
  category?: InputMaybe<TaskBoardCategory>;
  companyId: Scalars['ID'];
  filters?: InputMaybe<TaskBoardFiltersOptions>;
  limit?: InputMaybe<Scalars['Int']>;
  type: TaskBoardType;
};


export type QueryTaskBoardsV3Args = {
  filter?: InputMaybe<TaskBoardFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<TaskBoardSort>;
};


export type QueryTaskTemplateArgs = {
  companyId: Scalars['ID'];
  id: Scalars['ID'];
};


export type QueryTaskTemplatesArgs = {
  companyId: Scalars['ID'];
};


export type QueryTasksArgs = {
  category?: InputMaybe<TaskBoardCategory>;
  companyId: Scalars['ID'];
  filters?: InputMaybe<FilterOptions>;
};


export type QueryTasksV3Args = {
  filter?: InputMaybe<TaskFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<TaskSort>;
};


export type QueryTeamStatusesArgs = {
  companyTeamId: Scalars['ID'];
};


export type QueryTimesheetArgs = {
  timesheetId: Scalars['ID'];
};


export type QueryTimesheetApprovalsArgs = {
  companyId: Scalars['ID'];
  memberId?: InputMaybe<Scalars['ID']>;
};


export type QueryTimesheetsArgs = {
  companyId: Scalars['ID'];
  filters?: InputMaybe<TimesheetFilterOptions>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryWorkspaceArgs = {
  id: Scalars['ID'];
};


export type QueryWorkspacesArgs = {
  companyId: Scalars['ID'];
  ids?: InputMaybe<Array<Scalars['ID']>>;
};

export type ReceivePaymentInvoiceInput = {
  date?: InputMaybe<Scalars['DateTime']>;
  invoiceId: Scalars['ID'];
  received: Scalars['Float'];
};

export type ReminderStatus = {
  __typename?: 'ReminderStatus';
  email?: Maybe<ServiceHistory>;
  whatsapp?: Maybe<ServiceHistory>;
};

export enum ReminderStatusTypes {
  Failed = 'FAILED',
  InProgress = 'IN_PROGRESS',
  Sent = 'SENT'
}

export type RemoveFromProjectVisibilityWhitelistInput = {
  memberIds?: InputMaybe<Array<Scalars['ID']>>;
  projectId: Scalars['ID'];
  teamIds?: InputMaybe<Array<Scalars['ID']>>;
};

export type RemoveFromTaskVisibilityWhitelistInput = {
  memberIds?: InputMaybe<Array<Scalars['ID']>>;
  taskId: Scalars['ID'];
  teamIds?: InputMaybe<Array<Scalars['ID']>>;
};

export type RemoveFromVisibilityWhitelistInput = {
  boardId: Scalars['ID'];
  memberIds?: InputMaybe<Array<Scalars['ID']>>;
  teamIds?: InputMaybe<Array<Scalars['ID']>>;
};

export type RemoveFromWorkspaceVisibilityWhitelistInput = {
  memberIds?: InputMaybe<Array<Scalars['ID']>>;
  teamIds?: InputMaybe<Array<Scalars['ID']>>;
  workspaceId: Scalars['ID'];
};

export type RemoveMembersFromCollectionInput = {
  collectionId: Scalars['ID'];
  memberIds: Array<Scalars['ID']>;
};

export type RemoveProjectsFromWorkspaceInput = {
  projectIds: Array<Scalars['ID']>;
  workspaceId: Scalars['ID'];
};

export type RemoveTaskBoardsFromFolderInput = {
  boardIds: Array<Scalars['ID']>;
};

export type RemoveTaskWatchersInput = {
  memberIds: Array<Scalars['ID']>;
  taskId: Scalars['ID'];
};

export type ReorderGroupInput = {
  projectId: Scalars['ID'];
  reorderedGroups: Array<ReorderedGroup>;
};

export type ReorderedGroup = {
  groupId: Scalars['ID'];
  ordering: Scalars['Int'];
};

export type RequestAccountDeletionInput = {
  alternateEmail?: InputMaybe<Scalars['String']>;
  reason: Scalars['String'];
};

export type RequestAccountDeletionResponse = {
  __typename?: 'RequestAccountDeletionResponse';
  message?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['Boolean']>;
};

export type ResourcePermission = {
  __typename?: 'ResourcePermission';
  companyMembers?: Maybe<Array<Maybe<CompanyMember>>>;
  company_members?: Maybe<Array<Maybe<CompanyMember>>>;
  teams?: Maybe<Array<Maybe<CompanyTeam>>>;
};

export type ResourcePermissionInput = {
  companyMemberIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  company_member_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  teamIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  team_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** Add more resources as necessary, it will be combined with its own id, eg. task_26 */
export enum ResourceType {
  Collection = 'COLLECTION',
  Task = 'TASK'
}

export type SendInvoiceInput = {
  emails?: InputMaybe<Array<Scalars['String']>>;
  invoiceId: Scalars['ID'];
};

export type ServiceHistory = {
  __typename?: 'ServiceHistory';
  collection?: Maybe<Collection>;
  id?: Maybe<Scalars['ID']>;
  status?: Maybe<ReminderStatusTypes>;
  to?: Maybe<Scalars['String']>;
  type?: Maybe<ServiceHistoryTypes>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updated_at?: Maybe<Scalars['DateTime']>;
};

export enum ServiceHistoryTypes {
  Email = 'EMAIL',
  Whatsapp = 'WHATSAPP'
}

export type SetAttendanceVerificationImageInput = {
  imageUrl: Scalars['String'];
  s3Bucket: Scalars['String'];
  s3Key: Scalars['String'];
};

export type SetDefaultCompanyPaymentMethodInput = {
  companyId: Scalars['ID'];
  stripePaymentMethodId: Scalars['ID'];
};

export type SetProjectVisibilityInput = {
  projectId: Scalars['ID'];
  visibility: ProjectVisibility;
};

export type SetTaskBoardVisibilityInput = {
  boardId: Scalars['ID'];
  visibility: TaskBoardVisibility;
};

export type SetTaskVisibilityInput = {
  taskId: Scalars['ID'];
  visibility: CommonVisibility;
};

export type SetWorkspaceVisibilityInput = {
  visibility: CommonVisibility;
  workspaceId: Scalars['ID'];
};

export type ShortUrl = {
  __typename?: 'ShortUrl';
  active?: Maybe<Scalars['Boolean']>;
  created_at?: Maybe<Scalars['DateTime']>;
  full_url?: Maybe<Scalars['String']>;
  short_id?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export enum StageType {
  Closed = 'CLOSED',
  Fail = 'FAIL',
  Pass = 'PASS',
  Pending = 'PENDING'
}

export type StartAttendanceEntryInput = {
  address?: InputMaybe<Scalars['String']>;
  comments?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  image_url?: InputMaybe<Scalars['String']>;
  lat?: InputMaybe<Scalars['Latitude']>;
  lng?: InputMaybe<Scalars['Longitude']>;
  s3Bucket?: InputMaybe<Scalars['String']>;
  s3Key?: InputMaybe<Scalars['String']>;
  s3_bucket?: InputMaybe<Scalars['String']>;
  s3_key?: InputMaybe<Scalars['String']>;
  tagIds?: InputMaybe<Array<Scalars['ID']>>;
  type: AttendanceType;
  verificationType?: InputMaybe<AttendanceVerificationType>;
  verification_type?: InputMaybe<AttendanceVerificationType>;
};

export type StartSubscriptionInput = {
  companyId: Scalars['ID'];
  interval: SubscriptionPriceInterval;
  packageId: Scalars['ID'];
};

export type StripeCoupon = {
  __typename?: 'StripeCoupon';
  amountOff?: Maybe<Scalars['Float']>;
  amount_off?: Maybe<Scalars['Float']>;
  appliesTo?: Maybe<ProductInCoupon>;
  applies_to?: Maybe<ProductInCoupon>;
  created?: Maybe<Scalars['Int']>;
  currency?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  maxRedemptions?: Maybe<Scalars['Int']>;
  max_redemptions?: Maybe<Scalars['Int']>;
  metadata?: Maybe<StripeCouponMetaData>;
  name?: Maybe<Scalars['String']>;
  object?: Maybe<Scalars['String']>;
  percentOff?: Maybe<Scalars['Float']>;
  percent_off?: Maybe<Scalars['Float']>;
  redeemBy?: Maybe<Scalars['Int']>;
  redeem_by?: Maybe<Scalars['Int']>;
  timesRedeemed?: Maybe<Scalars['Int']>;
  times_redeemed?: Maybe<Scalars['Int']>;
  valid?: Maybe<Scalars['Boolean']>;
};

export type StripeCouponMetaData = {
  __typename?: 'StripeCouponMetaData';
  applicableProducts?: Maybe<Array<Maybe<Scalars['ID']>>>;
  applicable_products?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

export type StripeCustomerDetails = {
  __typename?: 'StripeCustomerDetails';
  default_currency?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
};

export type StripeInvoice = {
  __typename?: 'StripeInvoice';
  accountCountry?: Maybe<Scalars['String']>;
  accountName?: Maybe<Scalars['String']>;
  account_country?: Maybe<Scalars['String']>;
  account_name?: Maybe<Scalars['String']>;
  amountDue?: Maybe<Scalars['Int']>;
  amountPaid?: Maybe<Scalars['Int']>;
  amountRemaining?: Maybe<Scalars['Int']>;
  amount_due?: Maybe<Scalars['Int']>;
  amount_paid?: Maybe<Scalars['Int']>;
  amount_remaining?: Maybe<Scalars['Int']>;
  attemptCount?: Maybe<Scalars['Int']>;
  attempt_count?: Maybe<Scalars['Int']>;
  attempted?: Maybe<Scalars['Boolean']>;
  billingReason?: Maybe<Scalars['String']>;
  billing_reason?: Maybe<Scalars['String']>;
  charge?: Maybe<Scalars['String']>;
  collection_method?: Maybe<Scalars['String']>;
  created?: Maybe<Scalars['Int']>;
  currency?: Maybe<Scalars['String']>;
  customer?: Maybe<Scalars['String']>;
  customerAddress?: Maybe<Scalars['String']>;
  customerEmail?: Maybe<Scalars['String']>;
  customerName?: Maybe<Scalars['String']>;
  customerPhone?: Maybe<Scalars['String']>;
  customerShipping?: Maybe<Scalars['String']>;
  customerTaxExempt?: Maybe<Scalars['String']>;
  customer_address?: Maybe<Scalars['String']>;
  customer_email?: Maybe<Scalars['String']>;
  customer_name?: Maybe<Scalars['String']>;
  customer_phone?: Maybe<Scalars['String']>;
  customer_shipping?: Maybe<Scalars['String']>;
  customer_tax_exempt?: Maybe<Scalars['String']>;
  defaultPaymentMethod?: Maybe<Scalars['String']>;
  default_payment_method?: Maybe<Scalars['String']>;
  dueDate?: Maybe<Scalars['String']>;
  due_date?: Maybe<Scalars['String']>;
  endingBalance?: Maybe<Scalars['Int']>;
  ending_balance?: Maybe<Scalars['Int']>;
  hostedInvoiceUrl?: Maybe<Scalars['String']>;
  hosted_invoice_url?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  invoicePdf?: Maybe<Scalars['String']>;
  invoice_pdf?: Maybe<Scalars['String']>;
  nextPaymentAttempt?: Maybe<Scalars['Int']>;
  next_payment_attempt?: Maybe<Scalars['Int']>;
  number?: Maybe<Scalars['String']>;
  object?: Maybe<Scalars['String']>;
  paid?: Maybe<Scalars['Boolean']>;
  paymentIntent?: Maybe<Scalars['String']>;
  payment_intent?: Maybe<Scalars['String']>;
  periodEnd?: Maybe<Scalars['Int']>;
  periodStart?: Maybe<Scalars['Int']>;
  period_end?: Maybe<Scalars['Int']>;
  period_start?: Maybe<Scalars['Int']>;
  receiptNumber?: Maybe<Scalars['String']>;
  receipt_number?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  subscription?: Maybe<Scalars['String']>;
  subtotal?: Maybe<Scalars['Int']>;
  tax?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
  webhooksDeliveredAt?: Maybe<Scalars['Int']>;
  webhooks_delivered_at?: Maybe<Scalars['Int']>;
};

export type StripePromoCode = {
  __typename?: 'StripePromoCode';
  active?: Maybe<Scalars['Boolean']>;
  code?: Maybe<Scalars['String']>;
  coupon?: Maybe<StripeCoupon>;
  created?: Maybe<Scalars['Int']>;
  customer?: Maybe<Scalars['String']>;
  expiresAt?: Maybe<Scalars['Int']>;
  expires_at?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['ID']>;
  maxRedemptions?: Maybe<Scalars['Int']>;
  max_redemptions?: Maybe<Scalars['Int']>;
  timesRedeemed?: Maybe<Scalars['Int']>;
  times_redeemed?: Maybe<Scalars['Int']>;
};

/** New subscription type for the new subscription model */
export type Subscription = {
  __typename?: 'Subscription';
  company?: Maybe<Company>;
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  intervalType?: Maybe<SubscriptionPriceInterval>;
  invoiceQuota?: Maybe<Scalars['Int']>;
  package?: Maybe<SubscriptionPackage>;
  reportQuota?: Maybe<Scalars['Int']>;
  /** In bytes */
  storageQuota?: Maybe<Scalars['Float']>;
  stripeSubscriptionId?: Maybe<Scalars['String']>;
  taskQuota?: Maybe<Scalars['Int']>;
  teamQuota?: Maybe<Scalars['Int']>;
  upcomingChanges?: Maybe<Array<Maybe<SubscriptionChange>>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  userQuota?: Maybe<Scalars['Int']>;
};

export type SubscriptionChange = {
  __typename?: 'SubscriptionChange';
  action?: Maybe<Scalars['String']>;
  actionData?: Maybe<Scalars['JSON']>;
  runAt?: Maybe<Scalars['DateTime']>;
};

export type SubscriptionDiscount = {
  __typename?: 'SubscriptionDiscount';
  coupon?: Maybe<StripeCoupon>;
  customer?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  promotionCode?: Maybe<Scalars['String']>;
  promotion_code?: Maybe<Scalars['String']>;
  start?: Maybe<Scalars['Int']>;
  subscription?: Maybe<Scalars['String']>;
};

/**
 * Covers new and legacy subscription types. The legacy one goes to 'packages' table while
 * the new one goes to the 'subscription_packages' table.
 */
export type SubscriptionPackage = {
  __typename?: 'SubscriptionPackage';
  /**
   * Deactivated packages should not be renewed automatically [not implemented yet] and
   * cannot be activated on a user's account
   */
  active?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<User>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  deletedBy?: Maybe<User>;
  deleted_at?: Maybe<Scalars['DateTime']>;
  deleted_by?: Maybe<User>;
  description?: Maybe<Scalars['String']>;
  emailQuota?: Maybe<Scalars['Int']>;
  email_quota?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  invoiceQuota?: Maybe<Scalars['Int']>;
  /** This indicates whether it's a custom package created by admin */
  isCustom?: Maybe<Scalars['Boolean']>;
  /**
   * This indicates which is the free tier package, for the system to know which package to assign to a new company.
   * There's no error checking on this, it's up to the admin to make sure there's only one default package.
   */
  isDefault?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  packagePrices?: Maybe<Array<Maybe<SubscriptionPackagePrice>>>;
  package_prices?: Maybe<Array<Maybe<SubscriptionPackagePrice>>>;
  phoneCallQuota?: Maybe<Scalars['Int']>;
  phone_call_quota?: Maybe<Scalars['Int']>;
  productId?: Maybe<Scalars['String']>;
  product_id?: Maybe<Scalars['String']>;
  products?: Maybe<Array<Maybe<SubscriptionProduct>>>;
  /** Published would be shown on the frontend, unpublished covers custom packages or internal use ones */
  published?: Maybe<Scalars['Boolean']>;
  reportQuota?: Maybe<Scalars['Int']>;
  sequence?: Maybe<Scalars['Int']>;
  signatureQuota?: Maybe<Scalars['Int']>;
  signature_quota?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
  smsQuota?: Maybe<Scalars['Int']>;
  sms_quota?: Maybe<Scalars['Int']>;
  storage?: Maybe<Scalars['Float']>;
  /** In bytes */
  storageQuota?: Maybe<Scalars['Float']>;
  taskQuota?: Maybe<Scalars['Int']>;
  teamQuota?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<PackageTypes>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  updated_at?: Maybe<Scalars['DateTime']>;
  updated_by?: Maybe<User>;
  userQuota?: Maybe<Scalars['Int']>;
  whatsappQuota?: Maybe<Scalars['Int']>;
  whatsapp_quota?: Maybe<Scalars['Int']>;
};

export type SubscriptionPackagePrice = {
  __typename?: 'SubscriptionPackagePrice';
  active?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<User>;
  currency?: Maybe<Scalars['String']>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  deletedBy?: Maybe<User>;
  deleted_at?: Maybe<Scalars['DateTime']>;
  deleted_by?: Maybe<User>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  interval?: Maybe<Scalars['String']>;
  intervalCount?: Maybe<Scalars['Int']>;
  interval_count?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  package?: Maybe<SubscriptionPackage>;
  price?: Maybe<Scalars['Float']>;
  stripePriceId?: Maybe<Scalars['String']>;
  stripe_price_id?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  updated_at?: Maybe<Scalars['DateTime']>;
  updated_by?: Maybe<User>;
};

/** This data comes from Stripe and is not stored in DB */
export type SubscriptionPrice = {
  __typename?: 'SubscriptionPrice';
  amount?: Maybe<Scalars['Float']>;
  currency?: Maybe<Scalars['String']>;
  interval?: Maybe<Scalars['String']>;
  stripePriceId?: Maybe<Scalars['String']>;
  stripeProductId?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export enum SubscriptionPriceInterval {
  Month = 'MONTH',
  Year = 'YEAR'
}

/** Each product is a module/feature and can be enabled/disabled for a subscription package */
export type SubscriptionProduct = {
  __typename?: 'SubscriptionProduct';
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  /**
   * After creating a new price, it takes a few seconds to be available in Stripe, so
   * it will not be available in the API until it's available in Stripe
   */
  prices?: Maybe<Array<Maybe<SubscriptionPrice>>>;
  stripeProductId?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
};

export type SubscriptionPromoCode = {
  __typename?: 'SubscriptionPromoCode';
  amountOff?: Maybe<Scalars['Float']>;
  amount_off?: Maybe<Scalars['Float']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  created_at?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['ID']>;
  percentOff?: Maybe<Scalars['Int']>;
  percent_off?: Maybe<Scalars['Int']>;
  promoCodeId?: Maybe<Scalars['String']>;
  promo_code_id?: Maybe<Scalars['String']>;
  subscription?: Maybe<CompanySubscription>;
};

export type SubscriptionQuantityResult = {
  __typename?: 'SubscriptionQuantityResult';
  assigned?: Maybe<Scalars['Int']>;
  companyMembers?: Maybe<Array<Maybe<CompanyMember>>>;
  company_members?: Maybe<Array<Maybe<CompanyMember>>>;
  total?: Maybe<Scalars['Int']>;
};

export enum SubscriptionStatuses {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Incomplete = 'INCOMPLETE',
  Overdue = 'OVERDUE',
  Trial = 'TRIAL'
}

export type Subtask = {
  __typename?: 'Subtask';
  checked?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  sequence?: Maybe<Scalars['Int']>;
  task?: Maybe<Task>;
  title?: Maybe<Scalars['String']>;
};

export type SubtaskInput = {
  title: Scalars['String'];
};

export type SubtaskSequencesInput = {
  sequence?: InputMaybe<Scalars['Int']>;
  subtaskId: Scalars['ID'];
};

export type SubtaskUpdateInput = {
  checked?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
};

export type SwitchSubscriptionPackageInput = {
  packagePriceId?: InputMaybe<Scalars['ID']>;
  package_price_id: Scalars['ID'];
  quantity?: InputMaybe<Scalars['Int']>;
};

export type Tag = {
  __typename?: 'Tag';
  color?: Maybe<Scalars['String']>;
  company?: Maybe<Company>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  group?: Maybe<TagGroup>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type TagGroup = {
  __typename?: 'TagGroup';
  company?: Maybe<Company>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

/** Task refers to "card" in DB */
export type Task = {
  __typename?: 'Task';
  actualCost?: Maybe<Scalars['Float']>;
  actualEffort?: Maybe<Scalars['Float']>;
  actualEnd?: Maybe<Scalars['DateTime']>;
  actualStart?: Maybe<Scalars['DateTime']>;
  actualValue?: Maybe<Scalars['Float']>;
  actual_cost?: Maybe<Scalars['Float']>;
  actual_end?: Maybe<Scalars['DateTime']>;
  actual_start?: Maybe<Scalars['DateTime']>;
  approvedCost?: Maybe<Scalars['Float']>;
  archived?: Maybe<Scalars['Boolean']>;
  archivedAt?: Maybe<Scalars['DateTime']>;
  archivedBy?: Maybe<User>;
  attachments?: Maybe<Array<Maybe<TaskAttachment>>>;
  checklists?: Maybe<Array<Maybe<Checklist>>>;
  childTasks?: Maybe<Array<Maybe<Task>>>;
  comments?: Maybe<Array<Maybe<TaskComment>>>;
  company?: Maybe<Company>;
  companyTeam?: Maybe<CompanyTeam>;
  /** if a card has a sub_status_id = 50 and status = 2, in card_statuses it will be id = 50 and parent_status = 2 */
  companyTeamStatus?: Maybe<CompanyTeamStatus>;
  company_team?: Maybe<CompanyTeam>;
  company_team_status?: Maybe<CompanyTeamStatus>;
  completed?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<User>;
  customValues?: Maybe<Array<Maybe<TaskCustomValue>>>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  deleted_at?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  dueDate?: Maybe<Scalars['DateTime']>;
  dueReminder?: Maybe<Scalars['DateTime']>;
  due_date?: Maybe<Scalars['DateTime']>;
  due_reminder?: Maybe<Scalars['DateTime']>;
  endDate?: Maybe<Scalars['DateTime']>;
  end_date?: Maybe<Scalars['DateTime']>;
  fileType?: Maybe<Scalars['String']>;
  file_type?: Maybe<Scalars['String']>;
  group?: Maybe<ProjectGroup>;
  id: Scalars['ID'];
  members?: Maybe<Array<Maybe<TaskMember>>>;
  name?: Maybe<Scalars['String']>;
  parentTask?: Maybe<Task>;
  pics?: Maybe<Array<Maybe<TaskPic>>>;
  pinned?: Maybe<Scalars['Boolean']>;
  plannedEffort?: Maybe<Scalars['Int']>;
  planned_effort?: Maybe<Scalars['Int']>;
  posY?: Maybe<Scalars['Int']>;
  /** 2022/01/12 - Specifically for task activity tracker, but may be available to normal task in the future */
  priority?: Maybe<TaskPriorityType>;
  project?: Maybe<TaskBoard>;
  projectStatus?: Maybe<ProjectStatus>;
  projectedCost?: Maybe<Scalars['Float']>;
  projectedValue?: Maybe<Scalars['Float']>;
  projected_cost?: Maybe<Scalars['Float']>;
  published?: Maybe<Scalars['Boolean']>;
  spentEffort?: Maybe<Scalars['Int']>;
  spent_effort?: Maybe<Scalars['Int']>;
  stageStatus?: Maybe<StageType>;
  startDate?: Maybe<Scalars['DateTime']>;
  start_date?: Maybe<Scalars['DateTime']>;
  /** To be deprecated and replace by stageStatus */
  status?: Maybe<CompanyTeamStatusType>;
  subtasks?: Maybe<Array<Maybe<Subtask>>>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  /** To get sub_status_id */
  taskActivities?: Maybe<Array<Maybe<TaskActivity>>>;
  taskBoard?: Maybe<TaskBoard>;
  taskBoardTeam?: Maybe<TaskBoardTeam>;
  task_activities?: Maybe<Array<Maybe<TaskActivity>>>;
  task_board?: Maybe<TaskBoard>;
  task_board_team?: Maybe<TaskBoardTeam>;
  templateTask?: Maybe<TaskTemplate>;
  timeSpent?: Maybe<Scalars['Int']>;
  timeSpentMember?: Maybe<Scalars['Int']>;
  time_spent?: Maybe<Scalars['Int']>;
  timerTotals?: Maybe<Array<Maybe<TaskTimerTotal>>>;
  timer_totals?: Maybe<Array<Maybe<TaskTimerTotal>>>;
  timesheets?: Maybe<Array<Maybe<Timesheet>>>;
  /** Total of hourly rate * timesheet approval hour of all members under that task(see Time Approval page on FE) */
  totalRate?: Maybe<Scalars['Float']>;
  /** Type is deprecated as of 2021/10/13, will always be "Task" */
  type?: Maybe<TaskType>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updated_at?: Maybe<Scalars['DateTime']>;
  value?: Maybe<Scalars['Float']>;
  visibility?: Maybe<CommonVisibility>;
  visibilityWhitelist?: Maybe<CommonVisibilityWhitelist>;
  watchers?: Maybe<Array<Maybe<TaskWatcher>>>;
};


/** Task refers to "card" in DB */
export type TaskChecklistsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** Task refers to "card" in DB */
export type TaskCommentsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** Task refers to "card" in DB */
export type TaskSubtasksArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


/** Task refers to "card" in DB */
export type TaskTotalRateArgs = {
  dates: Array<TaskQueryTotalRate>;
};

export enum TaskActionType {
  AssigneeAdded = 'ASSIGNEE_ADDED',
  AssigneeRemoved = 'ASSIGNEE_REMOVED',
  AttachmentRemoved = 'ATTACHMENT_REMOVED',
  AttachmentUploaded = 'ATTACHMENT_UPLOADED',
  PicAdded = 'PIC_ADDED',
  PicRemoved = 'PIC_REMOVED',
  TaskArchived = 'TASK_ARCHIVED',
  TaskCreated = 'TASK_CREATED',
  TaskRemoved = 'TASK_REMOVED',
  TaskUnarchived = 'TASK_UNARCHIVED',
  UpdatedDueDate = 'UPDATED_DUE_DATE',
  UpdatedEndDate = 'UPDATED_END_DATE',
  UpdatedStartDate = 'UPDATED_START_DATE',
  UpdatedTeamStatus = 'UPDATED_TEAM_STATUS'
}

export type TaskActivity = {
  __typename?: 'TaskActivity';
  actionType?: Maybe<Scalars['String']>;
  action_type?: Maybe<Scalars['String']>;
  attachment?: Maybe<TaskAttachment>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<User>;
  fieldName?: Maybe<Scalars['String']>;
  field_name?: Maybe<Scalars['String']>;
  fromCardStatus?: Maybe<CompanyTeamStatus>;
  fromDate?: Maybe<Scalars['DateTime']>;
  fromLabel?: Maybe<Scalars['String']>;
  fromValueTo?: Maybe<Scalars['String']>;
  from_card_status?: Maybe<CompanyTeamStatus>;
  from_date?: Maybe<Scalars['DateTime']>;
  from_label?: Maybe<Scalars['String']>;
  from_value_to?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  targetMember?: Maybe<CompanyMember>;
  targetPic?: Maybe<ContactPic>;
  target_member?: Maybe<CompanyMember>;
  target_pic?: Maybe<ContactPic>;
  task?: Maybe<Task>;
  toCardStatus?: Maybe<CompanyTeamStatus>;
  toDate?: Maybe<Scalars['DateTime']>;
  toLabel?: Maybe<Scalars['String']>;
  toValue?: Maybe<Scalars['String']>;
  to_card_status?: Maybe<CompanyTeamStatus>;
  to_date?: Maybe<Scalars['DateTime']>;
  to_label?: Maybe<Scalars['String']>;
  to_value?: Maybe<Scalars['String']>;
};

export type TaskAttachment = {
  __typename?: 'TaskAttachment';
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  documentHash?: Maybe<Scalars['String']>;
  document_hash?: Maybe<Scalars['String']>;
  encoding?: Maybe<Scalars['String']>;
  externalSource?: Maybe<ExternalFileSource>;
  fileSize?: Maybe<Scalars['Int']>;
  file_size?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  isDeleted?: Maybe<Scalars['Boolean']>;
  isExternal?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

/** Task Board refers to job in DB */
export type TaskBoard = {
  __typename?: 'TaskBoard';
  archived?: Maybe<Scalars['Boolean']>;
  archivedAt?: Maybe<Scalars['DateTime']>;
  archivedBy?: Maybe<User>;
  associateBy?: Maybe<User>;
  associate_by?: Maybe<User>;
  category?: Maybe<TaskBoardCategory>;
  color?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  company?: Maybe<Company>;
  contact?: Maybe<Contact>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<User>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  deletedBy?: Maybe<User>;
  deleted_at?: Maybe<Scalars['DateTime']>;
  deleted_by?: Maybe<User>;
  description?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['DateTime']>;
  end_date?: Maybe<Scalars['DateTime']>;
  folder?: Maybe<TaskBoardFolder>;
  groups?: Maybe<Array<Maybe<ProjectGroup>>>;
  id?: Maybe<Scalars['ID']>;
  members?: Maybe<Array<Maybe<TaskMember>>>;
  name?: Maybe<Scalars['String']>;
  owners?: Maybe<Array<Maybe<TaskBoardOwner>>>;
  pinned?: Maybe<Scalars['Boolean']>;
  projectSettings?: Maybe<ProjectSettings>;
  projectStatuses?: Maybe<Array<Maybe<ProjectStatus>>>;
  published?: Maybe<Scalars['Boolean']>;
  slug?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['DateTime']>;
  start_date?: Maybe<Scalars['DateTime']>;
  /** Not the same kind of status in Task */
  status?: Maybe<TaskBoardStatusType>;
  taskBoardTeams?: Maybe<Array<Maybe<TaskBoardTeam>>>;
  task_board_teams?: Maybe<Array<Maybe<TaskBoardTeam>>>;
  tasks?: Maybe<Array<Maybe<Task>>>;
  timeSpent?: Maybe<Scalars['Int']>;
  time_spent?: Maybe<Scalars['Int']>;
  type?: Maybe<TaskBoardType>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  updated_at?: Maybe<Scalars['DateTime']>;
  updated_by?: Maybe<User>;
  value?: Maybe<Scalars['Int']>;
  visibility?: Maybe<CommonVisibility>;
  visibilityWhitelist?: Maybe<CommonVisibilityWhitelist>;
  workspace?: Maybe<Workspace>;
};


/** Task Board refers to job in DB */
export type TaskBoardTasksArgs = {
  filters?: InputMaybe<FilterOptions>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export enum TaskBoardCategory {
  Default = 'DEFAULT',
  Project = 'PROJECT'
}

export type TaskBoardFilter = {
  boardType?: InputMaybe<TaskBoardType>;
  category?: InputMaybe<TaskBoardCategory>;
  dueDateRange?: InputMaybe<Array<Scalars['DateTime']>>;
  isOverdue?: InputMaybe<Scalars['Boolean']>;
  memberAssigneeIds?: InputMaybe<Array<Scalars['ID']>>;
  memberOwnerIds?: InputMaybe<Array<Scalars['ID']>>;
  tagIds?: InputMaybe<Array<Scalars['ID']>>;
};

export type TaskBoardFiltersOptions = {
  memberId?: InputMaybe<Scalars['ID']>;
};

export type TaskBoardFolder = {
  __typename?: 'TaskBoardFolder';
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  taskBoards?: Maybe<Array<Maybe<TaskBoard>>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
};

export enum TaskBoardFolderType {
  Collaboration = 'COLLABORATION',
  Internal = 'INTERNAL',
  Personal = 'PERSONAL',
  Project = 'PROJECT'
}

export type TaskBoardInput = {
  category?: InputMaybe<TaskBoardCategory>;
  color?: InputMaybe<Scalars['String']>;
  companyId?: InputMaybe<Scalars['ID']>;
  company_id: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  owners?: InputMaybe<Array<Scalars['String']>>;
  status: Scalars['Int'];
  type: TaskBoardType;
};

export type TaskBoardOwner = {
  __typename?: 'TaskBoardOwner';
  board?: Maybe<TaskBoard>;
  companyMember?: Maybe<CompanyMember>;
};

export type TaskBoardSort = {
  direction?: InputMaybe<SortDirection>;
  type?: InputMaybe<TaskBoardSortType>;
};

export enum TaskBoardSortType {
  CreatedAt = 'CREATED_AT',
  Name = 'NAME'
}

export enum TaskBoardStatusType {
  Cancelled = 'CANCELLED',
  Done = 'DONE',
  Progress = 'PROGRESS'
}

export type TaskBoardTeam = {
  __typename?: 'TaskBoardTeam';
  companyTeam?: Maybe<CompanyTeam>;
  company_team?: Maybe<CompanyTeam>;
  id: Scalars['ID'];
  tasks?: Maybe<Array<Maybe<Task>>>;
};

export type TaskBoardTeamDeleteInput = {
  task_board_team_ids: Array<InputMaybe<Scalars['ID']>>;
};

export type TaskBoardTeamInput = {
  job_id: Scalars['ID'];
  team_id: Scalars['ID'];
};

export enum TaskBoardType {
  All = 'ALL',
  Collaboration = 'COLLABORATION',
  Company = 'COMPANY',
  Internal = 'INTERNAL',
  Personal = 'PERSONAL'
}

export type TaskBoardUpdateInput = {
  category?: InputMaybe<TaskBoardCategory>;
  color?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  /** "owners" are company member IDs */
  owners?: InputMaybe<Array<Scalars['String']>>;
  published?: InputMaybe<Scalars['Boolean']>;
  type: TaskBoardType;
};

export enum TaskBoardVisibility {
  Assigned = 'ASSIGNED',
  Hidden = 'HIDDEN',
  Private = 'PRIVATE',
  Public = 'PUBLIC',
  Specific = 'SPECIFIC'
}

export type TaskBoardVisibilityWhitelist = {
  __typename?: 'TaskBoardVisibilityWhitelist';
  members?: Maybe<Array<Maybe<CompanyMember>>>;
  teams?: Maybe<Array<Maybe<CompanyTeam>>>;
};

export type TaskComment = {
  __typename?: 'TaskComment';
  attachments?: Maybe<Array<Maybe<TaskAttachment>>>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<User>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  deletedBy?: Maybe<User>;
  deleted_at?: Maybe<Scalars['DateTime']>;
  deleted_by?: Maybe<User>;
  id: Scalars['ID'];
  message?: Maybe<Scalars['String']>;
  messageContent?: Maybe<Scalars['String']>;
  parentTaskComment?: Maybe<TaskComment>;
  task?: Maybe<Task>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  updated_at?: Maybe<Scalars['DateTime']>;
  updated_by?: Maybe<User>;
};

export type TaskCommentInput = {
  /** Either in PIC or Member UUID */
  mentionIds?: InputMaybe<Array<Scalars['ID']>>;
  /** Old mention system pattern: @[member-or-pic-uuid] */
  message?: InputMaybe<Scalars['String']>;
  /** Must be in JSON file */
  messageContent?: InputMaybe<Scalars['String']>;
  /** If have parentId, means it is a reply or children, no parentId is a parent comment. */
  parentId?: InputMaybe<Scalars['ID']>;
};

export type TaskCommentUpdateInput = {
  message?: InputMaybe<Scalars['String']>;
  messageContent?: InputMaybe<Scalars['String']>;
};

export type TaskCustomValue = {
  __typename?: 'TaskCustomValue';
  attribute?: Maybe<ProjectGroupCustomAttribute>;
  group?: Maybe<ProjectGroup>;
  task?: Maybe<Task>;
  value?: Maybe<Scalars['String']>;
};

export type TaskDeleteInput = {
  task_ids: Array<InputMaybe<Scalars['ID']>>;
};

export enum TaskDueRemindersType {
  FifteenM = 'FIFTEEN_M',
  FiveM = 'FIVE_M',
  OneDay = 'ONE_DAY',
  OneHour = 'ONE_HOUR',
  OnDue = 'ON_DUE',
  TenM = 'TEN_M',
  TwoDay = 'TWO_DAY',
  TwoHour = 'TWO_HOUR'
}

export type TaskFilter = {
  boardType?: InputMaybe<TaskBoardType>;
  category?: InputMaybe<TaskBoardCategory>;
  contactIds?: InputMaybe<Array<Scalars['ID']>>;
  dueDateRange?: InputMaybe<Array<Scalars['DateTime']>>;
  ids?: InputMaybe<Array<Scalars['ID']>>;
  isOverdue?: InputMaybe<Scalars['Boolean']>;
  isRecurring?: InputMaybe<Scalars['Boolean']>;
  memberAssigneeIds?: InputMaybe<Array<Scalars['ID']>>;
  memberOwnerIds?: InputMaybe<Array<Scalars['ID']>>;
  picIds?: InputMaybe<Array<Scalars['ID']>>;
  priority?: InputMaybe<TaskPriorityType>;
  search?: InputMaybe<Scalars['String']>;
  stage?: InputMaybe<StageType>;
  startDateRange?: InputMaybe<Array<Scalars['DateTime']>>;
  subStatusId?: InputMaybe<Scalars['ID']>;
  tagIds?: InputMaybe<Array<Scalars['ID']>>;
};

export type TaskFilterOptions = {
  is_project?: InputMaybe<Scalars['Boolean']>;
};

export type TaskInput = {
  description?: InputMaybe<Scalars['String']>;
  dueDate?: InputMaybe<Scalars['DateTime']>;
  due_date?: InputMaybe<Scalars['DateTime']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  end_date?: InputMaybe<Scalars['DateTime']>;
  groupId?: InputMaybe<Scalars['ID']>;
  jobId?: InputMaybe<Scalars['ID']>;
  job_id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  parentId?: InputMaybe<Scalars['ID']>;
  plannedEffort?: InputMaybe<Scalars['Float']>;
  planned_effort?: InputMaybe<Scalars['Float']>;
  posY?: InputMaybe<Scalars['Int']>;
  priority?: InputMaybe<TaskPriorityType>;
  projectId?: InputMaybe<Scalars['ID']>;
  projectStatusId?: InputMaybe<Scalars['ID']>;
  projectedCost?: InputMaybe<Scalars['Float']>;
  projected_cost?: InputMaybe<Scalars['Float']>;
  published?: InputMaybe<Scalars['Boolean']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  start_date?: InputMaybe<Scalars['DateTime']>;
  subStatusId?: InputMaybe<Scalars['ID']>;
  sub_status_id?: InputMaybe<Scalars['ID']>;
  tagIds?: InputMaybe<Array<Scalars['ID']>>;
  teamId?: InputMaybe<Scalars['ID']>;
  team_id?: InputMaybe<Scalars['ID']>;
  value?: InputMaybe<Scalars['Float']>;
  visibility?: InputMaybe<TaskVisibilityType>;
  workspaceId?: InputMaybe<Scalars['ID']>;
};

export type TaskMember = {
  __typename?: 'TaskMember';
  companyMember?: Maybe<CompanyMember>;
  company_member?: Maybe<CompanyMember>;
  id: Scalars['ID'];
  task?: Maybe<Task>;
  user?: Maybe<User>;
};

export type TaskMemberFilter = {
  memberId?: InputMaybe<Scalars['ID']>;
  member_id?: InputMaybe<Scalars['ID']>;
};

export type TaskMemberInput = {
  companyMemberIds?: InputMaybe<Array<Scalars['ID']>>;
  company_member_ids: Array<InputMaybe<Scalars['ID']>>;
};

export type TaskPersonalInput = {
  description?: InputMaybe<Scalars['String']>;
  dueDate?: InputMaybe<Scalars['DateTime']>;
  due_date?: InputMaybe<Scalars['DateTime']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  end_date?: InputMaybe<Scalars['DateTime']>;
  jobId?: InputMaybe<Scalars['ID']>;
  job_id: Scalars['ID'];
  name: Scalars['String'];
  priority?: InputMaybe<TaskPriorityType>;
  published?: InputMaybe<Scalars['Boolean']>;
  stageStatus?: InputMaybe<StageType>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  start_date?: InputMaybe<Scalars['DateTime']>;
  status?: InputMaybe<PersonalStatusType>;
  value?: InputMaybe<Scalars['Float']>;
};

export type TaskPic = {
  __typename?: 'TaskPic';
  contact?: Maybe<Contact>;
  id: Scalars['ID'];
  pic?: Maybe<ContactPic>;
  task?: Maybe<Task>;
  user?: Maybe<User>;
};


export type TaskPicTaskArgs = {
  isProject?: InputMaybe<Scalars['Boolean']>;
};

export type TaskPicInput = {
  picIds?: InputMaybe<Array<Scalars['ID']>>;
  pic_ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type TaskPicsInput = {
  picIds: Array<Scalars['ID']>;
  taskId: Scalars['ID'];
};

export enum TaskPriorityType {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export type TaskQueryTotalRate = {
  day: Scalars['Int'];
  month: Scalars['Int'];
  year: Scalars['Int'];
};

export type TaskSequenceInput = {
  sequence?: InputMaybe<Scalars['Int']>;
  task_id?: InputMaybe<Scalars['ID']>;
};

export type TaskSort = {
  direction?: InputMaybe<SortDirection>;
  type?: InputMaybe<TaskSortType>;
};

export enum TaskSortType {
  CreatedAt = 'CREATED_AT',
  DueDate = 'DUE_DATE',
  Name = 'NAME',
  Priority = 'PRIORITY',
  Stage = 'STAGE'
}

export type TaskTag = {
  __typename?: 'TaskTag';
  tag?: Maybe<Tag>;
  task?: Maybe<Task>;
};

export type TaskTagOptions = {
  tagIds: Array<Scalars['ID']>;
  taskId: Scalars['ID'];
};

export type TaskTemplate = Template & {
  __typename?: 'TaskTemplate';
  attachments?: Maybe<Array<Maybe<TaskTemplateAttachment>>>;
  company?: Maybe<Company>;
  copyAttachments?: Maybe<Scalars['Boolean']>;
  copySubtasks?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  isRecurring?: Maybe<Scalars['Boolean']>;
  items?: Maybe<Array<Maybe<TaskTemplateItem>>>;
  name?: Maybe<Scalars['String']>;
  recurringSetting?: Maybe<TaskTemplateRecurringSetting>;
  templateId?: Maybe<Scalars['ID']>;
  type?: Maybe<TemplateType>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type TaskTemplateAttachment = {
  __typename?: 'TaskTemplateAttachment';
  bucket?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  filesize?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type TaskTemplateItem = {
  __typename?: 'TaskTemplateItem';
  description?: Maybe<Scalars['String']>;
  isSubtask?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  sequence?: Maybe<Scalars['Int']>;
};

/** Translated from cron string */
export type TaskTemplateRecurringSetting = {
  __typename?: 'TaskTemplateRecurringSetting';
  day?: Maybe<Scalars['Int']>;
  intervalType?: Maybe<Scalars['String']>;
  month?: Maybe<Scalars['Int']>;
  skipWeekend?: Maybe<Scalars['Boolean']>;
};

export type TaskTimerEntry = {
  __typename?: 'TaskTimerEntry';
  companyMember?: Maybe<CompanyMember>;
  company_member?: Maybe<CompanyMember>;
  createdAt?: Maybe<Scalars['DateTime']>;
  created_at?: Maybe<Scalars['DateTime']>;
  endDate?: Maybe<Scalars['DateTime']>;
  end_date?: Maybe<Scalars['DateTime']>;
  startDate?: Maybe<Scalars['DateTime']>;
  start_date?: Maybe<Scalars['DateTime']>;
  task?: Maybe<Task>;
  timeTotal?: Maybe<Scalars['Int']>;
  time_total?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updated_at?: Maybe<Scalars['DateTime']>;
};

export type TaskTimerTotal = {
  __typename?: 'TaskTimerTotal';
  companyMember?: Maybe<CompanyMember>;
  company_member?: Maybe<CompanyMember>;
  memberTotal?: Maybe<Scalars['Int']>;
  member_total?: Maybe<Scalars['Int']>;
};

export enum TaskType {
  Document = 'DOCUMENT',
  Task = 'TASK'
}

export type TaskUpdateInput = {
  actualEffort?: InputMaybe<Scalars['Float']>;
  actualEnd?: InputMaybe<Scalars['DateTime']>;
  actualStart?: InputMaybe<Scalars['DateTime']>;
  actualValue?: InputMaybe<Scalars['Float']>;
  description?: InputMaybe<Scalars['String']>;
  dueDate?: InputMaybe<Scalars['DateTime']>;
  dueReminder?: InputMaybe<Scalars['DateTime']>;
  due_date?: InputMaybe<Scalars['DateTime']>;
  due_reminder?: InputMaybe<Scalars['DateTime']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  end_date?: InputMaybe<Scalars['DateTime']>;
  name?: InputMaybe<Scalars['String']>;
  plannedEffort?: InputMaybe<Scalars['Float']>;
  planned_effort?: InputMaybe<Scalars['Float']>;
  priority?: InputMaybe<TaskPriorityType>;
  projectStatusId?: InputMaybe<Scalars['ID']>;
  projectedCost?: InputMaybe<Scalars['Float']>;
  projected_cost?: InputMaybe<Scalars['Float']>;
  published?: InputMaybe<Scalars['Boolean']>;
  sequence?: InputMaybe<Scalars['Int']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  start_date?: InputMaybe<Scalars['DateTime']>;
  subStatusId?: InputMaybe<Scalars['ID']>;
  sub_status_id?: InputMaybe<Scalars['ID']>;
  teamId?: InputMaybe<Scalars['ID']>;
  team_id?: InputMaybe<Scalars['ID']>;
  visibility?: InputMaybe<TaskVisibilityType>;
};

export enum TaskVisibilityType {
  Default = 'DEFAULT',
  /** And creator */
  Owners = 'OWNERS'
}

export type TaskWatcher = {
  __typename?: 'TaskWatcher';
  companyMember?: Maybe<CompanyMember>;
  task?: Maybe<Task>;
};

export type TeamStatusFilter = {
  sub_status_id?: InputMaybe<Scalars['ID']>;
};

export type Template = {
  company?: Maybe<Company>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<TemplateType>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export enum TemplateType {
  ProjectTask = 'PROJECT_TASK',
  Task = 'TASK'
}

export type Timesheet = {
  __typename?: 'Timesheet';
  activity?: Maybe<TimesheetActivity>;
  archived?: Maybe<TimesheetArchiveStatus>;
  comments?: Maybe<Scalars['String']>;
  companyMember?: Maybe<CompanyMember>;
  company_member?: Maybe<CompanyMember>;
  endDate?: Maybe<Scalars['DateTime']>;
  end_date?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  location?: Maybe<Location>;
  startDate?: Maybe<Scalars['DateTime']>;
  start_date?: Maybe<Scalars['DateTime']>;
  submitted_date?: Maybe<Scalars['DateTime']>;
  timeTotal?: Maybe<Scalars['Int']>;
  time_total?: Maybe<Scalars['Int']>;
};

export type TimesheetActivity = {
  __typename?: 'TimesheetActivity';
  active?: Maybe<Scalars['Boolean']>;
  created_at?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  task?: Maybe<Task>;
  updated_at?: Maybe<Scalars['DateTime']>;
};

export type TimesheetApprovalInput = {
  companyMemberId?: InputMaybe<Scalars['ID']>;
  taskId: Scalars['ID'];
};

export enum TimesheetApprovalStatus {
  Approved = 'APPROVED',
  Rejected = 'REJECTED'
}

export enum TimesheetArchiveStatus {
  False = 'FALSE',
  True = 'TRUE'
}

export type TimesheetDayApproval = {
  __typename?: 'TimesheetDayApproval';
  billable?: Maybe<Scalars['Boolean']>;
  companyMember?: Maybe<CompanyMember>;
  day?: Maybe<Scalars['Int']>;
  month?: Maybe<Scalars['Int']>;
  status?: Maybe<TimesheetApprovalStatus>;
  task?: Maybe<Task>;
  total?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
};

export type TimesheetDaysInput = {
  day: Scalars['Int'];
  month: Scalars['Int'];
  total: Scalars['Int'];
  year: Scalars['Int'];
};

export type TimesheetEntryInput = {
  comments?: InputMaybe<Scalars['String']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  start_date: Scalars['DateTime'];
  submittedDate?: InputMaybe<Scalars['DateTime']>;
  submitted_date?: InputMaybe<Scalars['DateTime']>;
  timeTotal?: InputMaybe<Scalars['Int']>;
  time_total?: InputMaybe<Scalars['Int']>;
};

export type TimesheetFilterOptions = {
  archived?: InputMaybe<ArchivedStatus>;
  selectedDate?: InputMaybe<Scalars['DateTime']>;
};

export type ToggleEnabledCustomColumnInput = {
  attributeId: Scalars['ID'];
  projectId: Scalars['ID'];
};

export type ToolTipsStatus = {
  __typename?: 'ToolTipsStatus';
  ADD_CLIENT_COLLECTOR?: Maybe<Scalars['Boolean']>;
  ADD_COMPANY_MEMBERS?: Maybe<Scalars['Boolean']>;
  ADD_COMPANY_TEAM?: Maybe<Scalars['Boolean']>;
  ADD_CONTACT?: Maybe<Scalars['Boolean']>;
  ADD_CONTACT_GROUP?: Maybe<Scalars['Boolean']>;
  ADD_INTERNAL_TASK_BOARD?: Maybe<Scalars['Boolean']>;
  ADD_TASK?: Maybe<Scalars['Boolean']>;
  ADD_TASK_BOARD_TEAM?: Maybe<Scalars['Boolean']>;
  ASSIGN_CONTACT_GROUP_FOR_CONTACT?: Maybe<Scalars['Boolean']>;
  COLLECTION_LIST_VIEW_TYPE_AND_STATUS_SORTING?: Maybe<Scalars['Boolean']>;
  CREATE_COLLECTION?: Maybe<Scalars['Boolean']>;
  CREATE_COMPANY?: Maybe<Scalars['Boolean']>;
  EDIT_COMPANY?: Maybe<Scalars['Boolean']>;
  EDIT_COMPANY_TEAM?: Maybe<Scalars['Boolean']>;
  EDIT_TASK?: Maybe<Scalars['Boolean']>;
  INITIAL?: Maybe<Scalars['Boolean']>;
  PAYMENTS_PAGE?: Maybe<Scalars['Boolean']>;
  SETUP_PAYMENT_DETAILS?: Maybe<Scalars['Boolean']>;
  SUBSCRIBE_PACKAGE?: Maybe<Scalars['Boolean']>;
  SWITCH_CONTACT_GROUP_TAB?: Maybe<Scalars['Boolean']>;
  TASK_SHARED_WITH_ME?: Maybe<Scalars['Boolean']>;
  TASK_VIEW_MODE?: Maybe<Scalars['Boolean']>;
  VIEW_COLLECTION?: Maybe<Scalars['Boolean']>;
  VIEW_CONTACT_DETAIL?: Maybe<Scalars['Boolean']>;
};

export type TotalNotificationCount = {
  __typename?: 'TotalNotificationCount';
  total?: Maybe<Scalars['Int']>;
};

export type TotalTimesheetApproval = {
  __typename?: 'TotalTimesheetApproval';
  day?: Maybe<Scalars['Int']>;
  month?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
};

export type UnarchiveTaskInput = {
  task_ids: Array<InputMaybe<Scalars['ID']>>;
};

export type UnreadCount = {
  __typename?: 'UnreadCount';
  unread?: Maybe<Scalars['Int']>;
};

export type UpdateAttendanceSettingsInput = {
  allowMobile?: InputMaybe<Scalars['Boolean']>;
  allowWeb?: InputMaybe<Scalars['Boolean']>;
  allow_mobile?: InputMaybe<Scalars['Boolean']>;
  allow_web?: InputMaybe<Scalars['Boolean']>;
  enable2d?: InputMaybe<Scalars['Boolean']>;
  enableBiometric?: InputMaybe<Scalars['Boolean']>;
  enable_2d?: InputMaybe<Scalars['Boolean']>;
  enable_biometric?: InputMaybe<Scalars['Boolean']>;
  requireLocation?: InputMaybe<Scalars['Boolean']>;
  requireVerification?: InputMaybe<Scalars['Boolean']>;
  require_location?: InputMaybe<Scalars['Boolean']>;
  require_verification?: InputMaybe<Scalars['Boolean']>;
};

export type UpdateBillingInvoiceInput = {
  billingInvoiceId: Scalars['ID'];
  docDate?: InputMaybe<Scalars['DateTime']>;
  /** Maximum 20 characters */
  docNo?: InputMaybe<Scalars['String']>;
  /** Get companyName from contactId */
  picId?: InputMaybe<Scalars['ID']>;
  /** Maximum 200 characters */
  remarks?: InputMaybe<Scalars['String']>;
  terms?: InputMaybe<Scalars['Int']>;
};

export type UpdateBillingInvoiceItemInput = {
  descriptionHdr?: InputMaybe<Scalars['String']>;
  discountPercentage?: InputMaybe<Scalars['Float']>;
  invoiceItemId: Scalars['ID'];
  /** aka Description_DTL, either update taskId to change name or change the itemName */
  itemName?: InputMaybe<Scalars['String']>;
  sequence?: InputMaybe<Scalars['Int']>;
  /** Either update taskId to change name or change the itemName */
  taskId?: InputMaybe<Scalars['ID']>;
  taxPercentage?: InputMaybe<Scalars['Float']>;
  unitPrice?: InputMaybe<Scalars['Float']>;
};

export type UpdateCollectionInput = {
  description?: InputMaybe<Scalars['String']>;
  dueDate?: InputMaybe<Scalars['DateTime']>;
  due_date?: InputMaybe<Scalars['DateTime']>;
  emailNotify?: InputMaybe<Scalars['Boolean']>;
  email_notify?: InputMaybe<Scalars['Boolean']>;
  isDraft?: InputMaybe<Scalars['Boolean']>;
  is_draft?: InputMaybe<Scalars['Boolean']>;
  notifyPics?: InputMaybe<Array<Scalars['ID']>>;
  notify_pics?: InputMaybe<Array<Scalars['ID']>>;
  refNo?: InputMaybe<Scalars['String']>;
  ref_no?: InputMaybe<Scalars['String']>;
  remindEnd_on?: InputMaybe<Scalars['DateTime']>;
  remindInterval?: InputMaybe<CollectionRemindIntervalTypes>;
  remindOnDate?: InputMaybe<Scalars['Int']>;
  remindOnMonth?: InputMaybe<Scalars['Int']>;
  remind_end_on?: InputMaybe<Scalars['DateTime']>;
  remind_interval?: InputMaybe<CollectionRemindIntervalTypes>;
  remind_on_date?: InputMaybe<Scalars['Int']>;
  remind_on_month?: InputMaybe<Scalars['Int']>;
  smsNotify?: InputMaybe<Scalars['Boolean']>;
  sms_notify?: InputMaybe<Scalars['Boolean']>;
  startMonth?: InputMaybe<Scalars['DateTime']>;
  start_month?: InputMaybe<Scalars['DateTime']>;
  title?: InputMaybe<Scalars['String']>;
  voiceNotify?: InputMaybe<Scalars['Boolean']>;
  voice_notify?: InputMaybe<Scalars['Boolean']>;
  whatsappNotify?: InputMaybe<Scalars['Boolean']>;
  whatsapp_notify?: InputMaybe<Scalars['Boolean']>;
};

export type UpdateCollectionPaymentTypeInput = {
  payment_type?: InputMaybe<CollectionPaymentTypes>;
};

export type UpdateCollectorInput = {
  id: Scalars['ID'];
  memberIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  member_ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  teamId?: InputMaybe<Scalars['ID']>;
  team_id?: InputMaybe<Scalars['ID']>;
};

export type UpdateCompanyHolidayInput = {
  active?: InputMaybe<CompanyHolidayStatus>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  end_date?: InputMaybe<Scalars['DateTime']>;
  name?: InputMaybe<Scalars['String']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  start_date?: InputMaybe<Scalars['DateTime']>;
};

export type UpdateCompanyInfoInput = {
  /** Only for invoice generation */
  accountCode?: InputMaybe<Scalars['String']>;
  address?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  /** Only for invoice generation */
  invoicePrefix?: InputMaybe<Scalars['String']>;
  invoiceStart?: InputMaybe<Scalars['Int']>;
  logoUrl?: InputMaybe<Scalars['String']>;
  logo_url?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  registrationCode?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
};

export type UpdateCompanyMemberInfoInput = {
  employeeTypeId?: InputMaybe<Scalars['ID']>;
  employee_type_id?: InputMaybe<Scalars['ID']>;
  hourlyRate?: InputMaybe<Scalars['Float']>;
  hourly_rate?: InputMaybe<Scalars['Float']>;
  position?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<CompanyMemberType>;
};

export type UpdateCompanyPermissionsInput = {
  manager?: InputMaybe<UpdateCrudInput>;
  member?: InputMaybe<UpdateCrudInput>;
};

export type UpdateCompanyTeamInfoInput = {
  memberIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  member_ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateCompanyTeamStatusInput = {
  color: Scalars['String'];
  label: Scalars['String'];
  parentStatus?: InputMaybe<CompanyTeamStatusType>;
  parent_status: CompanyTeamStatusType;
  percentage: Scalars['Int'];
  stage?: InputMaybe<StageType>;
};

export type UpdateCompanyWorkDayInput = {
  endHour?: InputMaybe<Scalars['String']>;
  end_hour: Scalars['String'];
  open: Scalars['Boolean'];
  startHour?: InputMaybe<Scalars['String']>;
  start_hour: Scalars['String'];
};

export type UpdateContactGroupInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateContactInput = {
  /** Only for invoice generation */
  accountCode?: InputMaybe<Scalars['String']>;
  address?: InputMaybe<Scalars['String']>;
  dealValue?: InputMaybe<Scalars['Float']>;
  deal_value?: InputMaybe<Scalars['Float']>;
  name: Scalars['String'];
  remarks?: InputMaybe<Scalars['String']>;
  type: ContactType;
};

export type UpdateContactPicInput = {
  contactNo?: InputMaybe<Scalars['String']>;
  contact_no?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  remarks?: InputMaybe<Scalars['String']>;
};

export type UpdateCrudInput = {
  member?: InputMaybe<CommonCrud>;
};

export type UpdateCustomTimesheetApprovalInput = {
  billable?: InputMaybe<Scalars['Boolean']>;
  date: Scalars['DateTime'];
  sheets: Array<CustomTimesheetApprovalInput>;
  status?: InputMaybe<TimesheetApprovalStatus>;
};

export type UpdateLocationInput = {
  address?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
  metadata?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  radius?: InputMaybe<Scalars['Float']>;
};

export type UpdatePaymentStatusInput = {
  collectionId?: InputMaybe<Scalars['ID']>;
  collectionPaymentId?: InputMaybe<Scalars['ID']>;
  collectionPeriodId?: InputMaybe<Scalars['ID']>;
  collection_id: Scalars['ID'];
  collection_payment_id: Scalars['ID'];
  collection_period_id: Scalars['ID'];
  remarks?: InputMaybe<Scalars['String']>;
  status: CollectionPaymentStatusTypes;
};

export type UpdateProfileInput = {
  contactNo?: InputMaybe<Scalars['String']>;
  contact_no?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  profileImage?: InputMaybe<Scalars['String']>;
  profile_image?: InputMaybe<Scalars['String']>;
};

export type UpdateProjectsArchivedStateInput = {
  archived: Scalars['Boolean'];
  projectIds: Array<Scalars['ID']>;
};

export type UpdateSubscriptionPackageProductsInput = {
  packageId: Scalars['ID'];
  productId: Scalars['ID'];
};

export type UpdateSubscriptionProductInput = {
  name: Scalars['String'];
};

export type UpdateTagGroupInput = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type UpdateTagInput = {
  color?: InputMaybe<Scalars['String']>;
  groupId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateTaskBoardFolderInput = {
  folderId: Scalars['ID'];
  name: Scalars['String'];
};

export type UpdateTaskBoardsArchivedStateInput = {
  archived: Scalars['Boolean'];
  boardIds: Array<InputMaybe<Scalars['String']>>;
};

export type UpdateTaskParentInput = {
  childTaskId: Scalars['ID'];
  destinationParentId: Scalars['ID'];
};

export type UpdateTaskParentResponse = {
  __typename?: 'UpdateTaskParentResponse';
  destinationTask: Task;
  sourceTask: Task;
};

export type UpdateTaskTemplateInput = {
  companyId: Scalars['ID'];
  cronString?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  isCopyAttachments?: InputMaybe<Scalars['Boolean']>;
  isCopySubtasks?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  templateId: Scalars['ID'];
};

export type UpdateTimesheetApprovalInput = {
  billable?: InputMaybe<Scalars['Boolean']>;
  date: Scalars['DateTime'];
  sheets: Array<TimesheetApprovalInput>;
  status?: InputMaybe<TimesheetApprovalStatus>;
};

export type UpdateTimesheetInput = {
  comments?: InputMaybe<Scalars['String']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  end_date?: InputMaybe<Scalars['DateTime']>;
};

export type UpdateToolTipsStatusInput = {
  ADD_CLIENT_COLLECTOR?: InputMaybe<Scalars['Boolean']>;
  ADD_COMPANY_MEMBERS?: InputMaybe<Scalars['Boolean']>;
  ADD_COMPANY_TEAM?: InputMaybe<Scalars['Boolean']>;
  ADD_CONTACT?: InputMaybe<Scalars['Boolean']>;
  ADD_CONTACT_GROUP?: InputMaybe<Scalars['Boolean']>;
  ADD_INTERNAL_TASK_BOARD?: InputMaybe<Scalars['Boolean']>;
  ADD_TASK?: InputMaybe<Scalars['Boolean']>;
  ADD_TASK_BOARD_TEAM?: InputMaybe<Scalars['Boolean']>;
  ASSIGN_CONTACT_GROUP_FOR_CONTACT?: InputMaybe<Scalars['Boolean']>;
  COLLECTION_LIST_VIEW_TYPE_AND_STATUS_SORTING?: InputMaybe<Scalars['Boolean']>;
  CREATE_COLLECTION?: InputMaybe<Scalars['Boolean']>;
  CREATE_COMPANY?: InputMaybe<Scalars['Boolean']>;
  EDIT_COMPANY?: InputMaybe<Scalars['Boolean']>;
  EDIT_COMPANY_TEAM?: InputMaybe<Scalars['Boolean']>;
  EDIT_TASK?: InputMaybe<Scalars['Boolean']>;
  INITIAL?: InputMaybe<Scalars['Boolean']>;
  PAYMENTS_PAGE?: InputMaybe<Scalars['Boolean']>;
  SETUP_PAYMENT_DETAILS?: InputMaybe<Scalars['Boolean']>;
  SUBSCRIBE_PACKAGE?: InputMaybe<Scalars['Boolean']>;
  SWITCH_CONTACT_GROUP_TAB?: InputMaybe<Scalars['Boolean']>;
  TASK_SHARED_WITH_ME?: InputMaybe<Scalars['Boolean']>;
  TASK_VIEW_MODE?: InputMaybe<Scalars['Boolean']>;
  VIEW_COLLECTION?: InputMaybe<Scalars['Boolean']>;
  VIEW_CONTACT_DETAIL?: InputMaybe<Scalars['Boolean']>;
};

export type UpdateUserNameInput = {
  name: Scalars['String'];
};

export type UpdateWorkspaceInput = {
  bgColor?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  workspaceId: Scalars['ID'];
};

export type UpgradeSubscriptionInput = {
  companyId: Scalars['ID'];
  interval: SubscriptionPriceInterval;
  packageId: Scalars['ID'];
  subscriptionId: Scalars['ID'];
};

export type UploadMemberReferenceImageInput = {
  imageUrl?: InputMaybe<Scalars['String']>;
  image_url: Scalars['String'];
  s3Bucket?: InputMaybe<Scalars['String']>;
  s3Key?: InputMaybe<Scalars['String']>;
  s3_bucket: Scalars['String'];
  s3_key: Scalars['String'];
};

export type UploadPaymentReceiptInput = {
  collectionId?: InputMaybe<Scalars['ID']>;
  collectionPaymentId?: InputMaybe<Scalars['ID']>;
  collectionPeriodId?: InputMaybe<Scalars['ID']>;
  collection_id: Scalars['ID'];
  collection_payment_id: Scalars['ID'];
  collection_period_id: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  active?: Maybe<Scalars['Boolean']>;
  auth0Id?: Maybe<Scalars['String']>;
  auth0_id?: Maybe<Scalars['String']>;
  companies?: Maybe<Array<Maybe<Company>>>;
  contactNo?: Maybe<Scalars['String']>;
  contact_no?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  created_at?: Maybe<Scalars['DateTime']>;
  created_by?: Maybe<User>;
  customerId?: Maybe<Scalars['String']>;
  customer_id?: Maybe<Scalars['String']>;
  defaultCompany?: Maybe<Company>;
  defaultTimezone?: Maybe<Scalars['String']>;
  default_company?: Maybe<Company>;
  default_timezone?: Maybe<Scalars['String']>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  deletedBy?: Maybe<User>;
  deleted_at?: Maybe<Scalars['DateTime']>;
  deleted_by?: Maybe<User>;
  email?: Maybe<Scalars['String']>;
  emailAuth?: Maybe<Scalars['Boolean']>;
  emailVerificationCode?: Maybe<Scalars['String']>;
  emailVerified?: Maybe<Scalars['Boolean']>;
  email_auth?: Maybe<Scalars['Boolean']>;
  email_verification_code?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['Boolean']>;
  facebookId?: Maybe<Scalars['String']>;
  facebook_id?: Maybe<Scalars['String']>;
  googleId?: Maybe<Scalars['String']>;
  google_id?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  lastActiveAt?: Maybe<Scalars['DateTime']>;
  lastLogin?: Maybe<Scalars['DateTime']>;
  last_active_at?: Maybe<Scalars['DateTime']>;
  last_login?: Maybe<Scalars['DateTime']>;
  linkedinId?: Maybe<Scalars['String']>;
  linkedin_id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  onboarding?: Maybe<Scalars['JSON']>;
  paymentMethodId?: Maybe<Scalars['String']>;
  paymentMethods?: Maybe<Array<Maybe<PaymentMethod>>>;
  payment_method_id?: Maybe<Scalars['String']>;
  payment_methods?: Maybe<Array<Maybe<PaymentMethod>>>;
  profileImage?: Maybe<Scalars['String']>;
  profileImageSize?: Maybe<Scalars['Float']>;
  profileImages?: Maybe<ImageGroup>;
  profile_image?: Maybe<Scalars['String']>;
  refreshToken?: Maybe<Scalars['String']>;
  refresh_token?: Maybe<Scalars['String']>;
  registered?: Maybe<Scalars['Boolean']>;
  resetToken?: Maybe<Scalars['String']>;
  resetTokenValidity?: Maybe<Scalars['DateTime']>;
  reset_token?: Maybe<Scalars['String']>;
  reset_token_validity?: Maybe<Scalars['DateTime']>;
  signUpData?: Maybe<Scalars['JSON']>;
  stripeCustomerDetails?: Maybe<StripeCustomerDetails>;
  tooltipsStatus?: Maybe<ToolTipsStatus>;
  tooltips_status?: Maybe<ToolTipsStatus>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  updated_at?: Maybe<Scalars['DateTime']>;
  updated_by?: Maybe<User>;
  viewNotificationAt?: Maybe<Scalars['DateTime']>;
  viewOptions?: Maybe<Scalars['JSON']>;
  view_notification_at?: Maybe<Scalars['DateTime']>;
};

export type UserNotification = {
  __typename?: 'UserNotification';
  created_at?: Maybe<Scalars['DateTime']>;
  group?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  is_read?: Maybe<Scalars['Boolean']>;
  notification?: Maybe<Notification>;
  user?: Maybe<User>;
  user_type?: Maybe<UserNotificationType>;
  username?: Maybe<Scalars['String']>;
};

export enum UserNotificationType {
  Member = 'MEMBER',
  Pic = 'PIC'
}

export type VerificationImageUploadUrlResponse = {
  __typename?: 'VerificationImageUploadUrlResponse';
  s3Bucket?: Maybe<Scalars['String']>;
  s3Key?: Maybe<Scalars['String']>;
  s3_bucket?: Maybe<Scalars['String']>;
  s3_key?: Maybe<Scalars['String']>;
  uploadUrl?: Maybe<Scalars['String']>;
  upload_url?: Maybe<Scalars['String']>;
};

/** Once voided, cannot be unvoided */
export type VoidInvoiceInput = {
  invoiceId: Scalars['ID'];
};

export type WeeklyTimesheetFilterOptions = {
  companyMemberId?: InputMaybe<Scalars['ID']>;
  taskId?: InputMaybe<Scalars['ID']>;
  week: Scalars['Int'];
  year: Scalars['Int'];
};

export enum WorkDay {
  Friday = 'FRIDAY',
  Monday = 'MONDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
  Thursday = 'THURSDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY'
}

export type WorkHourTotals = {
  __typename?: 'WorkHourTotals';
  overtime?: Maybe<Scalars['Int']>;
  regular?: Maybe<Scalars['Int']>;
  tracked?: Maybe<Scalars['Int']>;
  worked?: Maybe<Scalars['Int']>;
};

export type Workspace = {
  __typename?: 'Workspace';
  bgColor?: Maybe<Scalars['String']>;
  company?: Maybe<Company>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<User>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  projects?: Maybe<Array<Maybe<TaskBoard>>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<User>;
  visibility?: Maybe<CommonVisibility>;
  visibilityWhitelist?: Maybe<CommonVisibilityWhitelist>;
};

export type AddMemberModalFragmentFragment = { __typename?: 'CompanyMember', id: string, hourlyRate?: number | null, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null };

export type AttendanceClockInAttendanceFragmentFragment = { __typename?: 'Attendance', id: string, startDate?: any | null, type?: AttendanceType | null, label?: { __typename?: 'AttendanceLabel', id: string, name?: string | null, color?: string | null } | null };

export type AttendanceClockInAttendanceSettingsFragmentFragment = { __typename?: 'AttendanceSettings', allowWeb?: boolean | null };

export type AttendanceClockInModalQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type AttendanceClockInModalQuery = { __typename?: 'Query', attendanceLabels?: Array<{ __typename?: 'AttendanceLabel', id: string, name?: string | null, color?: string | null, archived?: boolean | null } | null> | null, locations?: Array<{ __typename?: 'Location', id: string, name?: string | null, archived?: boolean | null } | null> | null, attendanceSettings?: { __typename?: 'AttendanceSettings', allowWeb?: boolean | null } | null, contacts?: Array<{ __typename?: 'Contact', id: string, name?: string | null } | null> | null };

export type StartAttendanceEntryMutationVariables = Exact<{
  companyMemberId: Scalars['ID'];
  input: StartAttendanceEntryInput;
  locationId?: InputMaybe<Scalars['ID']>;
  labelId?: InputMaybe<Scalars['ID']>;
  contactId?: InputMaybe<Scalars['ID']>;
}>;


export type StartAttendanceEntryMutation = { __typename?: 'Mutation', startAttendanceEntry?: { __typename?: 'Attendance', id: string } | null };

export type CloseAttendanceEntryMutationVariables = Exact<{
  companyMemberId: Scalars['ID'];
  commentsOut?: InputMaybe<Scalars['String']>;
}>;


export type CloseAttendanceEntryMutation = { __typename?: 'Mutation', closeAttendance?: { __typename?: 'Attendance', id: string } | null };

export type HeaderQueryVariables = Exact<{
  companyId: Scalars['ID'];
  memberId: Scalars['ID'];
}>;


export type HeaderQuery = { __typename?: 'Query', company?: { __typename?: 'Company', id?: string | null, activeSubscription?: Array<{ __typename?: 'CompanySubscription', id: string, type?: PackageTypes | null, whiteListedMembers?: { __typename?: 'SubscriptionQuantityResult', companyMembers?: Array<{ __typename?: 'CompanyMember', id: string } | null> | null } | null } | null> | null } | null, currentAttendance?: { __typename?: 'Attendance', id: string, startDate?: any | null, type?: AttendanceType | null, label?: { __typename?: 'AttendanceLabel', id: string, name?: string | null, color?: string | null } | null } | null, attendanceSettings?: { __typename?: 'AttendanceSettings', allowWeb?: boolean | null } | null };

export type CreateTaskMutationVariables = Exact<{
  input: TaskInput;
  memberIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>>;
  picIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>>;
}>;


export type CreateTaskMutation = { __typename?: 'Mutation', createTask?: { __typename?: 'Task', id: string } | null };

export type SharedTaskSubNavQueryVariables = Exact<{ [key: string]: never; }>;


export type SharedTaskSubNavQuery = { __typename?: 'Query', sharedWithMeTasks?: { __typename?: 'PaginatedSharedWithMeTasks', tasks?: Array<{ __typename?: 'Task', id: string, name?: string | null } | null> | null } | null };

export type TaskSubNavQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type TaskSubNavQuery = { __typename?: 'Query', companyTeams?: Array<{ __typename?: 'CompanyTeam', id: string, title?: string | null } | null> | null, projectTemplates?: Array<{ __typename?: 'ProjectTemplate', id?: string | null, name?: string | null, columns?: any | null, statuses?: Array<{ __typename?: 'ProjectTemplateStatus', id?: string | null, name?: string | null, color?: string | null, notify?: boolean | null } | null> | null } | null> | null, globalProjectTemplateGallery?: { __typename?: 'ProjectTemplateGallery', galleryTemplates?: any | null } | null };

export type CreateWorkspaceMutationVariables = Exact<{
  input: CreateWorkspaceInput;
}>;


export type CreateWorkspaceMutation = { __typename?: 'Mutation', createWorkspace?: { __typename?: 'Workspace', id?: string | null } | null };

export type UpdateWorkspaceMutationVariables = Exact<{
  input: UpdateWorkspaceInput;
}>;


export type UpdateWorkspaceMutation = { __typename?: 'Mutation', updateWorkspace?: { __typename?: 'Workspace', id?: string | null } | null };

export type DeleteWorkspacesMutationVariables = Exact<{
  input: DeleteWorkspacesInput;
}>;


export type DeleteWorkspacesMutation = { __typename?: 'Mutation', deleteWorkspaces?: Array<{ __typename?: 'Workspace', id?: string | null } | null> | null };

export type CreateProjectMutationVariables = Exact<{
  input: CreateProjectInput;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject?: { __typename?: 'TaskBoard', id?: string | null, projectStatuses?: Array<{ __typename?: 'ProjectStatus', id?: string | null } | null> | null } | null };

export type DeleteProjectsMutationVariables = Exact<{
  input: DeleteProjectsInput;
}>;


export type DeleteProjectsMutation = { __typename?: 'Mutation', deleteProjects?: Array<{ __typename?: 'TaskBoard', id?: string | null } | null> | null };

export type MoveProjectsToWorkspaceMutationVariables = Exact<{
  input: MoveProjectsToWorkspaceInput;
}>;


export type MoveProjectsToWorkspaceMutation = { __typename?: 'Mutation', moveProjectsToWorkspace?: Array<{ __typename?: 'Workspace', id?: string | null } | null> | null };

export type CreateProjectTemplateMutationVariables = Exact<{
  input: ProjectTemplateInput;
}>;


export type CreateProjectTemplateMutation = { __typename?: 'Mutation', createProjectTemplate?: { __typename?: 'ProjectTemplate', id?: string | null } | null };

export type EditProjectTemplateMutationVariables = Exact<{
  input: ProjectTemplateEditInput;
}>;


export type EditProjectTemplateMutation = { __typename?: 'Mutation', editProjectTemplate?: { __typename?: 'ProjectTemplate', id?: string | null } | null };

export type CreateProjectTemplateStatusMutationVariables = Exact<{
  input: CreateProjectTemplateStatusInput;
}>;


export type CreateProjectTemplateStatusMutation = { __typename?: 'Mutation', createProjectTemplateStatus?: { __typename?: 'ProjectTemplateStatus', id?: string | null } | null };

export type EditProjectTemplateStatusMutationVariables = Exact<{
  input: ProjectTemplateStatusEditInput;
}>;


export type EditProjectTemplateStatusMutation = { __typename?: 'Mutation', editProjectTemplateStatus?: { __typename?: 'ProjectTemplateStatus', id?: string | null } | null };

export type DeleteProjectTemplateStatusesMutationVariables = Exact<{
  input: ProjectTemplateStatusIdsInput;
}>;


export type DeleteProjectTemplateStatusesMutation = { __typename?: 'Mutation', deleteProjectTemplateStatuses?: Array<{ __typename?: 'ProjectTemplateStatus', id?: string | null } | null> | null };

export type DeleteProjectTemplatesMutationVariables = Exact<{
  input: DeleteProjectTemplateIdsInput;
}>;


export type DeleteProjectTemplatesMutation = { __typename?: 'Mutation', deleteProjectTemplates?: Array<{ __typename?: 'ProjectTemplate', id?: string | null } | null> | null };

export type EditProjectSettingsMutationVariables = Exact<{
  input: ProjectSettingsEditInput;
}>;


export type EditProjectSettingsMutation = { __typename?: 'Mutation', editProjectSettings?: { __typename?: 'ProjectSettings', columns?: any | null } | null };

export type AddToVisibilityWhitelistProjectMutationVariables = Exact<{
  input: AddToProjectVisibilityWhitelistInput;
}>;


export type AddToVisibilityWhitelistProjectMutation = { __typename?: 'Mutation', addToVisibilityWhitelistProject?: { __typename?: 'TaskBoard', id?: string | null } | null };

export type AddToWorkspaceVisibilityWhitelistMutationVariables = Exact<{
  input: AddToWorkspaceVisibilityWhitelistInput;
}>;


export type AddToWorkspaceVisibilityWhitelistMutation = { __typename?: 'Mutation', addToWorkspaceVisibilityWhitelist?: { __typename?: 'Workspace', id?: string | null } | null };

export type RemoveFromVisibilityWhitelistProjectMutationVariables = Exact<{
  input: RemoveFromProjectVisibilityWhitelistInput;
}>;


export type RemoveFromVisibilityWhitelistProjectMutation = { __typename?: 'Mutation', removeFromVisibilityWhitelistProject?: { __typename?: 'TaskBoard', id?: string | null } | null };

export type RemoveFromWorkspaceVisibilityWhitelistMutationVariables = Exact<{
  input: RemoveFromWorkspaceVisibilityWhitelistInput;
}>;


export type RemoveFromWorkspaceVisibilityWhitelistMutation = { __typename?: 'Mutation', removeFromWorkspaceVisibilityWhitelist?: { __typename?: 'Workspace', id?: string | null } | null };

export type UpdateProjectMutationVariables = Exact<{
  input: ProjectUpdateInput;
}>;


export type UpdateProjectMutation = { __typename?: 'Mutation', updateProject?: { __typename?: 'TaskBoard', id?: string | null } | null };

export type CreateProjectStatusMutationVariables = Exact<{
  input: CreateProjectStatusInput;
}>;


export type CreateProjectStatusMutation = { __typename?: 'Mutation', createProjectStatus?: { __typename?: 'ProjectStatus', id?: string | null } | null };

export type EditProjectStatusMutationVariables = Exact<{
  input: ProjectStatusEditInput;
}>;


export type EditProjectStatusMutation = { __typename?: 'Mutation', editProjectStatus?: { __typename?: 'ProjectStatus', id?: string | null } | null };

export type DeleteProjectStatusesMutationVariables = Exact<{
  input: DeleteProjectStatusInput;
}>;


export type DeleteProjectStatusesMutation = { __typename?: 'Mutation', deleteProjectStatuses?: Array<{ __typename?: 'ProjectStatus', id?: string | null } | null> | null };

export type SetProjectVisibilityMutationVariables = Exact<{
  input: SetProjectVisibilityInput;
}>;


export type SetProjectVisibilityMutation = { __typename?: 'Mutation', setProjectVisibility?: { __typename?: 'TaskBoard', id?: string | null } | null };

export type SetWorkspaceVisibilityMutationVariables = Exact<{
  input: SetWorkspaceVisibilityInput;
}>;


export type SetWorkspaceVisibilityMutation = { __typename?: 'Mutation', setWorkspaceVisibility?: { __typename?: 'Workspace', id?: string | null } | null };

export type CopyProjectMutationVariables = Exact<{
  input: CopyProjectInput;
}>;


export type CopyProjectMutation = { __typename?: 'Mutation', copyProject?: { __typename?: 'TaskBoard', id?: string | null } | null };

export type UpdateProjectsArchivedStateMutationVariables = Exact<{
  input: UpdateProjectsArchivedStateInput;
}>;


export type UpdateProjectsArchivedStateMutation = { __typename?: 'Mutation', updateProjectsArchivedState?: Array<{ __typename?: 'TaskBoard', id?: string | null } | null> | null };

export type CreateProjectGroupTaskSubMutationVariables = Exact<{
  input: CreateProjectGroupInput;
}>;


export type CreateProjectGroupTaskSubMutation = { __typename?: 'Mutation', createProjectGroup?: { __typename?: 'ProjectGroup', id?: string | null } | null };

export type CreateTaskTaskSubNavMutationVariables = Exact<{
  input: TaskInput;
}>;


export type CreateTaskTaskSubNavMutation = { __typename?: 'Mutation', createTask?: { __typename?: 'Task', id: string } | null };

export type CreateCustomColumnForGroupTaskSubNavMutationVariables = Exact<{
  input: CreateCustomColumnForGroupInput;
}>;


export type CreateCustomColumnForGroupTaskSubNavMutation = { __typename?: 'Mutation', createCustomColumnForGroup?: { __typename?: 'ProjectGroupCustomColumn', group?: { __typename?: 'ProjectGroup', id?: string | null } | null } | null };

export type CreateCompanyMutationVariables = Exact<{
  input: CreateCompanyInput;
}>;


export type CreateCompanyMutation = { __typename?: 'Mutation', createCompany?: { __typename?: 'Company', id?: string | null } | null };

export type UpdateCompanyTimezoneMutationVariables = Exact<{
  companyId: Scalars['ID'];
  timezone: Scalars['String'];
}>;


export type UpdateCompanyTimezoneMutation = { __typename?: 'Mutation', updateCompanyTimezone?: string | null };

export type UploadCompanyProfileImageMutationVariables = Exact<{
  companyId: Scalars['ID'];
  attachment: Scalars['Upload'];
}>;


export type UploadCompanyProfileImageMutation = { __typename?: 'Mutation', uploadCompanyProfileImage?: { __typename?: 'Company', id?: string | null } | null };

export type UpdateUserOnboardingMutationVariables = Exact<{
  payload?: InputMaybe<Scalars['JSON']>;
}>;


export type UpdateUserOnboardingMutation = { __typename?: 'Mutation', updateUserOnboarding?: { __typename?: 'User', id?: string | null } | null };

export type TaskListItemFragmentFragment = { __typename?: 'Task', id: string, name?: string | null, startDate?: any | null, endDate?: any | null, projectStatus?: { __typename?: 'ProjectStatus', id?: string | null, color?: string | null, name?: string | null } | null, comments?: Array<{ __typename?: 'TaskComment', id: string } | null> | null, checklists?: Array<{ __typename?: 'Checklist', id: string } | null> | null, members?: Array<{ __typename?: 'TaskMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null> | null, attachments?: Array<{ __typename?: 'TaskAttachment', id: string } | null> | null, project?: { __typename?: 'TaskBoard', id?: string | null, name?: string | null } | null };

export type CompanyInfoFragmentFragment = { __typename?: 'Company', id?: string | null, name?: string | null, logoUrl?: string | null, settings?: string | null, defaultTimezone?: string | null, slug?: string | null, members?: Array<{ __typename?: 'CompanyMember', id: string, type?: CompanyMemberType | null, active?: boolean | null, teams?: Array<{ __typename?: 'CompanyTeam', id: string, title?: string | null, members?: Array<{ __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null } | null } | null> | null } | null> | null, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null> | null, currentSubscription?: { __typename?: 'Subscription', id: string, invoiceQuota?: number | null, reportQuota?: number | null, storageQuota?: number | null, taskQuota?: number | null, teamQuota?: number | null, userQuota?: number | null, stripeSubscriptionId?: string | null, package?: { __typename?: 'SubscriptionPackage', id: string, name?: string | null, isCustom?: boolean | null, invoiceQuota?: number | null, reportQuota?: number | null, storageQuota?: number | null, taskQuota?: number | null, teamQuota?: number | null, userQuota?: number | null } | null } | null };

export type UserProfileFragmentFragment = { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, onboarding?: any | null, profileImage?: string | null, createdAt?: any | null, signUpData?: any | null, companies?: Array<{ __typename?: 'Company', id?: string | null, name?: string | null, logoUrl?: string | null, settings?: string | null, defaultTimezone?: string | null, slug?: string | null, members?: Array<{ __typename?: 'CompanyMember', id: string, type?: CompanyMemberType | null, active?: boolean | null, teams?: Array<{ __typename?: 'CompanyTeam', id: string, title?: string | null, members?: Array<{ __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null } | null } | null> | null } | null> | null, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null> | null, currentSubscription?: { __typename?: 'Subscription', id: string, invoiceQuota?: number | null, reportQuota?: number | null, storageQuota?: number | null, taskQuota?: number | null, teamQuota?: number | null, userQuota?: number | null, stripeSubscriptionId?: string | null, package?: { __typename?: 'SubscriptionPackage', id: string, name?: string | null, isCustom?: boolean | null, invoiceQuota?: number | null, reportQuota?: number | null, storageQuota?: number | null, taskQuota?: number | null, teamQuota?: number | null, userQuota?: number | null } | null } | null } | null> | null, defaultCompany?: { __typename?: 'Company', id?: string | null, name?: string | null, logoUrl?: string | null, settings?: string | null, defaultTimezone?: string | null, slug?: string | null, members?: Array<{ __typename?: 'CompanyMember', id: string, type?: CompanyMemberType | null, active?: boolean | null, teams?: Array<{ __typename?: 'CompanyTeam', id: string, title?: string | null, members?: Array<{ __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null } | null } | null> | null } | null> | null, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null> | null, currentSubscription?: { __typename?: 'Subscription', id: string, invoiceQuota?: number | null, reportQuota?: number | null, storageQuota?: number | null, taskQuota?: number | null, teamQuota?: number | null, userQuota?: number | null, stripeSubscriptionId?: string | null, package?: { __typename?: 'SubscriptionPackage', id: string, name?: string | null, isCustom?: boolean | null, invoiceQuota?: number | null, reportQuota?: number | null, storageQuota?: number | null, taskQuota?: number | null, teamQuota?: number | null, userQuota?: number | null } | null } | null } | null, stripeCustomerDetails?: { __typename?: 'StripeCustomerDetails', id?: string | null, default_currency?: string | null } | null };

export type TaskFragmentFragment = { __typename?: 'Task', id: string, name?: string | null, description?: string | null, dueDate?: any | null, startDate?: any | null, endDate?: any | null, dueReminder?: any | null, stageStatus?: StageType | null, createdAt?: any | null, priority?: TaskPriorityType | null, timeSpent?: number | null, projectedCost?: number | null, archived?: boolean | null, visibility?: CommonVisibility | null, published?: boolean | null, taskActivities?: Array<{ __typename?: 'TaskActivity', id: string, fieldName?: string | null, actionType?: string | null, fromValueTo?: string | null, toValue?: string | null, fromDate?: any | null, toDate?: any | null, fromLabel?: string | null, toLabel?: string | null, createdAt?: any | null, targetPic?: { __typename?: 'ContactPic', id: string, name?: string | null, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null } | null } | null, targetMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null } | null } | null, attachment?: { __typename?: 'TaskAttachment', id: string, name?: string | null } | null, fromCardStatus?: { __typename?: 'CompanyTeamStatus', id: string, label?: string | null } | null, toCardStatus?: { __typename?: 'CompanyTeamStatus', id: string, label?: string | null } | null, createdBy?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null> | null, tags?: Array<{ __typename?: 'Tag', id?: string | null, name?: string | null, color?: string | null } | null> | null, templateTask?: { __typename?: 'TaskTemplate', isRecurring?: boolean | null, id?: string | null, recurringSetting?: { __typename?: 'TaskTemplateRecurringSetting', intervalType?: string | null, day?: number | null, month?: number | null, skipWeekend?: boolean | null } | null } | null, companyTeamStatus?: { __typename?: 'CompanyTeamStatus', id: string, label?: string | null } | null, subtasks?: Array<{ __typename?: 'Subtask', id: string, title?: string | null, checked?: boolean | null, sequence?: number | null } | null> | null, createdBy?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null } | null, comments?: Array<{ __typename?: 'TaskComment', id: string, message?: string | null, messageContent?: string | null, createdAt?: any | null, createdBy?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null, parentTaskComment?: { __typename?: 'TaskComment', id: string, messageContent?: string | null, message?: string | null, createdAt?: any | null, createdBy?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null, attachments?: Array<{ __typename?: 'TaskAttachment', id: string, name?: string | null, isDeleted?: boolean | null, createdBy?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null> | null } | null> | null, members?: Array<{ __typename?: 'TaskMember', id: string, companyMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null } | null> | null, pics?: Array<{ __typename?: 'TaskPic', id: string, pic?: { __typename?: 'ContactPic', id: string, name?: string | null, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null } | null> | null, attachments?: Array<{ __typename?: 'TaskAttachment', id: string, name?: string | null, createdAt?: any | null, url?: string | null, isExternal?: boolean | null, externalSource?: ExternalFileSource | null, createdBy?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null> | null, companyTeam?: { __typename?: 'CompanyTeam', id: string, members?: Array<{ __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null } | null } | null> | null, statuses?: Array<{ __typename?: 'CompanyTeamStatus', id: string, label?: string | null, sequence?: number | null, parentStatus?: CompanyTeamStatusType | null } | null> | null } | null, taskBoard?: { __typename?: 'TaskBoard', id?: string | null, type?: TaskBoardType | null, category?: TaskBoardCategory | null, name?: string | null, company?: { __typename?: 'Company', id?: string | null } | null, contact?: { __typename?: 'Contact', id: string, name?: string | null, pics?: Array<{ __typename?: 'ContactPic', id: string, name?: string | null } | null> | null } | null, taskBoardTeams?: Array<{ __typename?: 'TaskBoardTeam', id: string, companyTeam?: { __typename?: 'CompanyTeam', id: string, members?: Array<{ __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null } | null } | null> | null } | null } | null> | null } | null };

export type BoardFragmentFragment = { __typename?: 'TaskBoard', id?: string | null, name?: string | null, description?: string | null, type?: TaskBoardType | null, archived?: boolean | null, category?: TaskBoardCategory | null, pinned?: boolean | null, visibility?: CommonVisibility | null, timeSpent?: number | null, color?: string | null, createdBy?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null } | null, visibilityWhitelist?: { __typename?: 'CommonVisibilityWhitelist', teams?: Array<{ __typename?: 'CompanyTeam', id: string, title?: string | null } | null> | null, members?: Array<{ __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null } | null } | null> | null } | null, owners?: Array<{ __typename?: 'TaskBoardOwner', companyMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', name?: string | null, email?: string | null } | null } | null } | null> | null, contact?: { __typename?: 'Contact', id: string, name?: string | null } | null, folder?: { __typename?: 'TaskBoardFolder', id?: string | null, name?: string | null } | null, members?: Array<{ __typename?: 'TaskMember', id: string } | null> | null, tasks?: Array<{ __typename?: 'Task', id: string, dueDate?: any | null, name?: string | null, description?: string | null, pinned?: boolean | null, stageStatus?: StageType | null, archived?: boolean | null, subtasks?: Array<{ __typename?: 'Subtask', id: string, title?: string | null, checked?: boolean | null } | null> | null, members?: Array<{ __typename?: 'TaskMember', id: string, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null> | null, companyTeamStatus?: { __typename?: 'CompanyTeamStatus', id: string, label?: string | null, color?: string | null, stage?: StageType | null } | null } | null> | null, taskBoardTeams?: Array<{ __typename?: 'TaskBoardTeam', id: string, companyTeam?: { __typename?: 'CompanyTeam', id: string, title?: string | null, statuses?: Array<{ __typename?: 'CompanyTeamStatus', id: string, label?: string | null, color?: string | null, stage?: StageType | null } | null> | null, members?: Array<{ __typename?: 'CompanyMember', user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null } | null } | null> | null } | null } | null> | null };

export type CompanyMemberFragmentFragment = { __typename?: 'CompanyMember', id: string, type?: CompanyMemberType | null, position?: string | null, createdAt?: any | null, hourlyRate?: number | null, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, active?: boolean | null } | null, referenceImage?: { __typename?: 'CompanyMemberReferenceImage', imageUrl?: string | null, s3Bucket?: string | null, s3Key?: string | null, status?: CompanyMemberReferenceImageStatus | null, remark?: string | null, actionBy?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null } | null } | null, employeeType?: { __typename?: 'EmployeeType', id: string } | null };

export type AttendanceDayFragmentFragment = { __typename?: 'AttendanceDaySummary', tracked?: number | null, regular?: number | null, overtime?: number | null, worked?: number | null, firstAttendance?: { __typename?: 'Attendance', startDate?: any | null, location?: { __typename?: 'Location', name?: string | null } | null } | null, lastAttendance?: { __typename?: 'Attendance', startDate?: any | null, endDate?: any | null, label?: { __typename?: 'AttendanceLabel', name?: string | null, color?: string | null } | null } | null, attendances?: Array<{ __typename?: 'Attendance', comments?: string | null, commentsOut?: string | null, startDate?: any | null, endDate?: any | null, type?: AttendanceType | null, timeTotal?: number | null, label?: { __typename?: 'AttendanceLabel', name?: string | null, color?: string | null } | null, location?: { __typename?: 'Location', name?: string | null } | null } | null> | null, companyMember?: { __typename?: 'CompanyMember', id: string, employeeType?: { __typename?: 'EmployeeType', id: string, name?: string | null, workDaySettings?: Array<{ __typename?: 'CompanyWorkDaySetting', timezone?: string | null } | null> | null } | null, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null };

export type PromoCodeInfoFragmentFragment = { __typename?: 'DiscountedPrice', id?: number | null, discounted_price?: number | null, price?: number | null, price_per_unit?: number | null, name?: string | null, interval?: string | null, package?: { __typename?: 'SubscriptionPackage', id: string } | null };

export type TaskTemplateFragmentFragment = { __typename?: 'TaskTemplate', id?: string | null, name?: string | null, description?: string | null, copySubtasks?: boolean | null, copyAttachments?: boolean | null, createdAt?: any | null, type?: TemplateType | null, isRecurring?: boolean | null, recurringSetting?: { __typename?: 'TaskTemplateRecurringSetting', intervalType?: string | null, day?: number | null, month?: number | null } | null, createdBy?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null, items?: Array<{ __typename?: 'TaskTemplateItem', name?: string | null, sequence?: number | null, isSubtask?: boolean | null } | null> | null, attachments?: Array<{ __typename?: 'TaskTemplateAttachment', name?: string | null } | null> | null };

export type TagGroupFragmentFragment = { __typename?: 'TagGroup', id?: string | null, name?: string | null, tags?: Array<{ __typename?: 'Tag', id?: string | null, name?: string | null } | null> | null };

export type UpdateTaskMutationVariables = Exact<{
  taskId: Scalars['ID'];
  input: TaskUpdateInput;
}>;


export type UpdateTaskMutation = { __typename?: 'Mutation', updateTask?: { __typename?: 'Task', id: string } | null };

export type AssignTaskTagsMutationVariables = Exact<{
  input: TaskTagOptions;
}>;


export type AssignTaskTagsMutation = { __typename?: 'Mutation', assignTaskTags?: Array<{ __typename?: 'TaskTag', tag?: { __typename?: 'Tag', id?: string | null } | null } | null> | null };

export type DeleteTaskTagsMutationVariables = Exact<{
  input: TaskTagOptions;
}>;


export type DeleteTaskTagsMutation = { __typename?: 'Mutation', deleteTaskTags?: Array<{ __typename?: 'TaskTag', tag?: { __typename?: 'Tag', id?: string | null } | null } | null> | null };

export type AssignTaskPicsMutationVariables = Exact<{
  taskId: Scalars['ID'];
  input: TaskPicInput;
}>;


export type AssignTaskPicsMutation = { __typename?: 'Mutation', assignTaskPics?: Array<{ __typename?: 'TaskPic', id: string } | null> | null };

export type RemoveTaskPicsMutationVariables = Exact<{
  input: TaskPicsInput;
}>;


export type RemoveTaskPicsMutation = { __typename?: 'Mutation', removeTaskPics?: Array<{ __typename?: 'TaskPic', id: string } | null> | null };

export type AddTaskWatchersMutationVariables = Exact<{
  input: AddTaskWatchersInput;
}>;


export type AddTaskWatchersMutation = { __typename?: 'Mutation', addTaskWatchers?: Array<{ __typename?: 'TaskWatcher', task?: { __typename?: 'Task', id: string } | null } | null> | null };

export type RemoveTaskWatchersMutationVariables = Exact<{
  input: RemoveTaskWatchersInput;
}>;


export type RemoveTaskWatchersMutation = { __typename?: 'Mutation', removeTaskWatchers?: Array<{ __typename?: 'TaskWatcher', task?: { __typename?: 'Task', id: string } | null } | null> | null };

export type AssignTaskMembersMutationVariables = Exact<{
  taskId: Scalars['ID'];
  input: TaskMemberInput;
}>;


export type AssignTaskMembersMutation = { __typename?: 'Mutation', assignTaskMembers?: Array<{ __typename?: 'TaskMember', id: string } | null> | null };

export type DeleteTaskMembersMutationVariables = Exact<{
  taskId: Scalars['ID'];
  input: TaskMemberInput;
}>;


export type DeleteTaskMembersMutation = { __typename?: 'Mutation', deleteTaskMembers?: Array<{ __typename?: 'TaskMember', id: string } | null> | null };

export type CreateTaskTemplateMutationVariables = Exact<{
  input: CreateTaskTemplateInput;
}>;


export type CreateTaskTemplateMutation = { __typename?: 'Mutation', createTaskTemplate?: { __typename?: 'TaskTemplate', id?: string | null } | null };

export type UpdateTaskTemplateMutationVariables = Exact<{
  input: UpdateTaskTemplateInput;
}>;


export type UpdateTaskTemplateMutation = { __typename?: 'Mutation', updateTaskTemplate?: { __typename?: 'TaskTemplate', id?: string | null } | null };

export type DeleteTaskTemplateMutationVariables = Exact<{
  input: DeleteTemplateInput;
}>;


export type DeleteTaskTemplateMutation = { __typename?: 'Mutation', deleteTaskTemplate?: { __typename?: 'TaskTemplate', id?: string | null } | null };

export type CreateTimesheetEntryMutationVariables = Exact<{
  taskId: Scalars['ID'];
  memberId: Scalars['ID'];
  input: TimesheetEntryInput;
  locationId?: InputMaybe<Scalars['ID']>;
}>;


export type CreateTimesheetEntryMutation = { __typename?: 'Mutation', createTimesheetEntry?: { __typename?: 'Timesheet', id: string } | null };

export type UpdateTimesheetMutationVariables = Exact<{
  timesheetId: Scalars['ID'];
  input: UpdateTimesheetInput;
}>;


export type UpdateTimesheetMutation = { __typename?: 'Mutation', updateTimesheet?: { __typename?: 'Timesheet', id: string } | null };

export type DedocoInfoPageQueryQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type DedocoInfoPageQueryQuery = { __typename?: 'Query', company?: { __typename?: 'Company', id?: string | null, activeSubscription?: Array<{ __typename?: 'CompanySubscription', id: string, type?: PackageTypes | null, signatureQuota?: number | null, price?: number | null, endDate?: any | null, productId?: string | null, whiteListedMembers?: { __typename?: 'SubscriptionQuantityResult', total?: number | null, assigned?: number | null, companyMembers?: Array<{ __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', name?: string | null, email?: string | null, contactNo?: string | null } | null } | null> | null } | null, package?: { __typename?: 'SubscriptionPackage', id: string, title?: string | null, signatureQuota?: number | null, productId?: string | null } | null, subscriptionPackagePrice?: { __typename?: 'SubscriptionPackagePrice', id: string, currency?: string | null } | null } | null> | null, members?: Array<{ __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', name?: string | null, email?: string | null, id?: string | null } | null } | null> | null } | null };

export type AssignSubscriptionQuantityToMemberMutationVariables = Exact<{
  companyMemberId: Scalars['ID'];
  stripeProductId: Scalars['String'];
}>;


export type AssignSubscriptionQuantityToMemberMutation = { __typename?: 'Mutation', assignSubscriptionQuantityToMember?: Array<{ __typename?: 'CompanyMember', id: string } | null> | null };

export type RemoveSubscriptionQuantityFromMemberMutationVariables = Exact<{
  companyMemberId: Scalars['ID'];
  stripeProductId: Scalars['String'];
}>;


export type RemoveSubscriptionQuantityFromMemberMutation = { __typename?: 'Mutation', removeSubscriptionQuantityFromMember?: Array<{ __typename?: 'CompanyMember', id: string } | null> | null };

export type AttendanceCardQueryVariables = Exact<{
  input: GetAttendancesInput;
}>;


export type AttendanceCardQuery = { __typename?: 'Query', attendances?: Array<{ __typename?: 'Attendance', id: string, type?: AttendanceType | null, startDate?: any | null, endDate?: any | null, timeTotal?: number | null, worked?: number | null, overtime?: number | null } | null> | null };

export type HomePageQueryVariables = Exact<{
  companyId: Scalars['ID'];
  filters?: InputMaybe<FilterOptions>;
  filter?: InputMaybe<TaskFilter>;
}>;


export type HomePageQuery = { __typename?: 'Query', tasks?: Array<{ __typename?: 'Task', id: string, name?: string | null, startDate?: any | null, endDate?: any | null, project?: { __typename?: 'TaskBoard', id?: string | null, name?: string | null } | null, projectStatus?: { __typename?: 'ProjectStatus', id?: string | null, color?: string | null, name?: string | null } | null, checklists?: Array<{ __typename?: 'Checklist', id: string, checked?: boolean | null } | null> | null, members?: Array<{ __typename?: 'TaskMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null> | null, comments?: Array<{ __typename?: 'TaskComment', id: string } | null> | null, attachments?: Array<{ __typename?: 'TaskAttachment', id: string } | null> | null } | null> | null, sharedWithMeTasks?: { __typename?: 'PaginatedSharedWithMeTasks', tasks?: Array<{ __typename?: 'Task', id: string, name?: string | null, startDate?: any | null, endDate?: any | null, project?: { __typename?: 'TaskBoard', id?: string | null, name?: string | null } | null, projectStatus?: { __typename?: 'ProjectStatus', id?: string | null, color?: string | null, name?: string | null } | null, checklists?: Array<{ __typename?: 'Checklist', id: string, checked?: boolean | null } | null> | null, members?: Array<{ __typename?: 'TaskMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null> | null, comments?: Array<{ __typename?: 'TaskComment', id: string } | null> | null, attachments?: Array<{ __typename?: 'TaskAttachment', id: string } | null> | null } | null> | null } | null, company?: { __typename?: 'Company', id?: string | null, teams?: Array<{ __typename?: 'CompanyTeam', id: string, title?: string | null } | null> | null } | null, contactGroups?: Array<{ __typename?: 'ContactGroup', id: string, name?: string | null } | null> | null, tagGroups?: Array<{ __typename?: 'TagGroup', id?: string | null, name?: string | null, tags?: Array<{ __typename?: 'Tag', id?: string | null, name?: string | null } | null> | null } | null> | null };

export type CreateContactMutationVariables = Exact<{
  companyId: Scalars['ID'];
  input: CreateContactInput;
  contactGroupId?: InputMaybe<Scalars['ID']>;
  dealCreator?: InputMaybe<Scalars['ID']>;
}>;


export type CreateContactMutation = { __typename?: 'Mutation', createContact?: { __typename?: 'Contact', id: string } | null };

export type CreateContactPicMutationVariables = Exact<{
  companyId: Scalars['ID'];
  contactId: Scalars['ID'];
  input: CreateContactPicInput;
}>;


export type CreateContactPicMutation = { __typename?: 'Mutation', createContactPic?: { __typename?: 'ContactPic', id: string } | null };

export type TaskCardTaskFragmentFragment = { __typename?: 'Task', id: string, name?: string | null, startDate?: any | null, endDate?: any | null, project?: { __typename?: 'TaskBoard', id?: string | null, name?: string | null } | null, projectStatus?: { __typename?: 'ProjectStatus', id?: string | null, color?: string | null, name?: string | null } | null, checklists?: Array<{ __typename?: 'Checklist', id: string, checked?: boolean | null } | null> | null, members?: Array<{ __typename?: 'TaskMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null> | null, comments?: Array<{ __typename?: 'TaskComment', id: string } | null> | null, attachments?: Array<{ __typename?: 'TaskAttachment', id: string } | null> | null };

export type LoginUserMutationMutationVariables = Exact<{ [key: string]: never; }>;


export type LoginUserMutationMutation = { __typename?: 'Mutation', loginUser?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, onboarding?: any | null, profileImage?: string | null, createdAt?: any | null, signUpData?: any | null, companies?: Array<{ __typename?: 'Company', id?: string | null, name?: string | null, logoUrl?: string | null, settings?: string | null, defaultTimezone?: string | null, slug?: string | null, members?: Array<{ __typename?: 'CompanyMember', id: string, type?: CompanyMemberType | null, active?: boolean | null, teams?: Array<{ __typename?: 'CompanyTeam', id: string, title?: string | null, members?: Array<{ __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null } | null } | null> | null } | null> | null, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null> | null, currentSubscription?: { __typename?: 'Subscription', id: string, invoiceQuota?: number | null, reportQuota?: number | null, storageQuota?: number | null, taskQuota?: number | null, teamQuota?: number | null, userQuota?: number | null, stripeSubscriptionId?: string | null, package?: { __typename?: 'SubscriptionPackage', id: string, name?: string | null, isCustom?: boolean | null, invoiceQuota?: number | null, reportQuota?: number | null, storageQuota?: number | null, taskQuota?: number | null, teamQuota?: number | null, userQuota?: number | null } | null } | null } | null> | null, defaultCompany?: { __typename?: 'Company', id?: string | null, name?: string | null, logoUrl?: string | null, settings?: string | null, defaultTimezone?: string | null, slug?: string | null, members?: Array<{ __typename?: 'CompanyMember', id: string, type?: CompanyMemberType | null, active?: boolean | null, teams?: Array<{ __typename?: 'CompanyTeam', id: string, title?: string | null, members?: Array<{ __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null } | null } | null> | null } | null> | null, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null> | null, currentSubscription?: { __typename?: 'Subscription', id: string, invoiceQuota?: number | null, reportQuota?: number | null, storageQuota?: number | null, taskQuota?: number | null, teamQuota?: number | null, userQuota?: number | null, stripeSubscriptionId?: string | null, package?: { __typename?: 'SubscriptionPackage', id: string, name?: string | null, isCustom?: boolean | null, invoiceQuota?: number | null, reportQuota?: number | null, storageQuota?: number | null, taskQuota?: number | null, teamQuota?: number | null, userQuota?: number | null } | null } | null } | null, stripeCustomerDetails?: { __typename?: 'StripeCustomerDetails', id?: string | null, default_currency?: string | null } | null } | null };

export type OnboardingPageQueryVariables = Exact<{ [key: string]: never; }>;


export type OnboardingPageQuery = { __typename?: 'Query', subscriptionPackages?: Array<{ __typename?: 'SubscriptionPackage', id: string, title?: string | null, type?: PackageTypes | null, emailQuota?: number | null, whatsappQuota?: number | null, packagePrices?: Array<{ __typename?: 'SubscriptionPackagePrice', id: string, price?: number | null, currency?: string | null, interval?: string | null } | null> | null } | null> | null, subscriptionPackagesV2?: Array<{ __typename?: 'SubscriptionPackage', id: string, name?: string | null, sequence?: number | null, products?: Array<{ __typename?: 'SubscriptionProduct', id: string, prices?: Array<{ __typename?: 'SubscriptionPrice', amount?: number | null, interval?: string | null } | null> | null } | null> | null } | null> | null };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile?: { __typename?: 'User', id?: string | null } | null };

export type OnboardingCreateCompanyMutationVariables = Exact<{
  input: CreateCompanyInput;
}>;


export type OnboardingCreateCompanyMutation = { __typename?: 'Mutation', createCompany?: { __typename?: 'Company', id?: string | null, slug?: string | null } | null };

export type AddMemberToCompanyMutationVariables = Exact<{
  companyId: Scalars['ID'];
  input: AddMemberToCompanyInput;
}>;


export type AddMemberToCompanyMutation = { __typename?: 'Mutation', addMemberToCompany?: { __typename?: 'Company', id?: string | null } | null };

export type CreateCompanyPaymentMethodMutationVariables = Exact<{
  input: CreateCompanyPaymentMethodInput;
}>;


export type CreateCompanyPaymentMethodMutation = { __typename?: 'Mutation', createCompanyPaymentMethod?: { __typename?: 'CompanyPaymentMethod', isDefault?: boolean | null } | null };

export type StartSubscriptionMutationVariables = Exact<{
  input: StartSubscriptionInput;
}>;


export type StartSubscriptionMutation = { __typename?: 'Mutation', startSubscription?: { __typename?: 'Subscription', id: string } | null };

export type PromoCodeInfoQueryVariables = Exact<{
  code: Scalars['String'];
  createSubscriptionInput: Array<InputMaybe<CreateSubscriptionInput>> | InputMaybe<CreateSubscriptionInput>;
}>;


export type PromoCodeInfoQuery = { __typename?: 'Query', promoCodeInfo?: Array<{ __typename?: 'DiscountedPrice', id?: number | null, discounted_price?: number | null, price?: number | null, price_per_unit?: number | null, name?: string | null, interval?: string | null, package?: { __typename?: 'SubscriptionPackage', id: string } | null } | null> | null };

export type ProfilePageQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfilePageQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, contactNo?: string | null, profileImage?: string | null, defaultTimezone?: string | null, profileImages?: { __typename?: 'ImageGroup', original?: string | null } | null } | null };

export type SetDefaultUserTimezoneMutationVariables = Exact<{
  timezone: Scalars['String'];
}>;


export type SetDefaultUserTimezoneMutation = { __typename?: 'Mutation', setDefaultUserTimezone?: { __typename?: 'User', id?: string | null } | null };

export type UploadProfileImageMutationVariables = Exact<{
  attachment: Scalars['Upload'];
}>;


export type UploadProfileImageMutation = { __typename?: 'Mutation', uploadProfileImage?: { __typename?: 'User', id?: string | null } | null };

export type UserProfileFormFragmentFragment = { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, contactNo?: string | null, profileImage?: string | null, defaultTimezone?: string | null, profileImages?: { __typename?: 'ImageGroup', original?: string | null } | null };

export type RedirectLinkPageQueryVariables = Exact<{
  shortId: Scalars['String'];
}>;


export type RedirectLinkPageQuery = { __typename?: 'Query', shortUrl?: { __typename?: 'ShortUrl', url?: string | null } | null };

export type SqlAccountingInfoPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type SqlAccountingInfoPageQuery = { __typename?: 'Query', company?: { __typename?: 'Company', id?: string | null, accountCode?: string | null } | null };

export type UpdateCompanyInfoMutationVariables = Exact<{
  companyId: Scalars['ID'];
  input: UpdateCompanyInfoInput;
}>;


export type UpdateCompanyInfoMutation = { __typename?: 'Mutation', updateCompanyInfo?: { __typename?: 'Company', id?: string | null } | null };

export type AttendancesDetailsPageQueryVariables = Exact<{
  companyMemberId: Scalars['ID'];
  input: GetAttendancesInput;
  companyId: Scalars['ID'];
  daySummaryInput: AttendanceDaySummaryInput;
  weekSummaryInput: AttendanceWeekSummaryInput;
}>;


export type AttendancesDetailsPageQuery = { __typename?: 'Query', companyMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null } | null } | null, attendances?: Array<{ __typename?: 'Attendance', id: string, startDate?: any | null, endDate?: any | null, type?: AttendanceType | null, verificationType?: AttendanceVerificationType | null, lat?: any | null, lng?: any | null, imageUrl?: string | null, timeTotal?: number | null, worked?: number | null, overtime?: number | null, address?: string | null, comments?: string | null, commentsOut?: string | null, location?: { __typename?: 'Location', id: string, name?: string | null, lat?: number | null, lng?: number | null, metadata?: string | null } | null, label?: { __typename?: 'AttendanceLabel', id: string, name?: string | null, color?: string | null } | null, contact?: { __typename?: 'Contact', id: string, name?: string | null } | null } | null> | null, attendanceDaySummary?: Array<{ __typename?: 'AttendanceDaySummary', tracked?: number | null, regular?: number | null, overtime?: number | null, worked?: number | null, firstAttendance?: { __typename?: 'Attendance', startDate?: any | null, location?: { __typename?: 'Location', name?: string | null } | null } | null, lastAttendance?: { __typename?: 'Attendance', startDate?: any | null, endDate?: any | null, label?: { __typename?: 'AttendanceLabel', name?: string | null, color?: string | null } | null } | null, attendances?: Array<{ __typename?: 'Attendance', comments?: string | null, commentsOut?: string | null, startDate?: any | null, endDate?: any | null, type?: AttendanceType | null, timeTotal?: number | null, label?: { __typename?: 'AttendanceLabel', name?: string | null, color?: string | null } | null, location?: { __typename?: 'Location', name?: string | null } | null } | null> | null, companyMember?: { __typename?: 'CompanyMember', id: string, employeeType?: { __typename?: 'EmployeeType', id: string, name?: string | null, workDaySettings?: Array<{ __typename?: 'CompanyWorkDaySetting', timezone?: string | null } | null> | null } | null, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null } | null> | null, attendanceWeekSummary?: Array<{ __typename?: 'AttendanceWeekSummary', monday?: number | null, tuesday?: number | null, wednesday?: number | null, thursday?: number | null, friday?: number | null, saturday?: number | null, sunday?: number | null, workedTotal?: number | null, overtimeTotal?: number | null, trackedTotal?: number | null, companyMember?: { __typename?: 'CompanyMember', id: string, employeeType?: { __typename?: 'EmployeeType', name?: string | null, workDaySettings?: Array<{ __typename?: 'CompanyWorkDaySetting', timezone?: string | null } | null> | null } | null, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null } | null> | null };

export type SetCompanyMemberReferenceImageStatusMutationVariables = Exact<{
  companyId: Scalars['ID'];
  companyMemberIds: Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>;
  status: CompanyMemberReferenceImageStatus;
  remark?: InputMaybe<Scalars['String']>;
}>;


export type SetCompanyMemberReferenceImageStatusMutation = { __typename?: 'Mutation', setCompanyMemberReferenceImageStatus?: Array<{ __typename?: 'CompanyMember', id: string, type?: CompanyMemberType | null, position?: string | null, createdAt?: any | null, hourlyRate?: number | null, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, active?: boolean | null } | null, referenceImage?: { __typename?: 'CompanyMemberReferenceImage', imageUrl?: string | null, s3Bucket?: string | null, s3Key?: string | null, status?: CompanyMemberReferenceImageStatus | null, remark?: string | null, actionBy?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null } | null } | null, employeeType?: { __typename?: 'EmployeeType', id: string } | null } | null> | null };

export type CompanyMemberSetReferenceImageMutationVariables = Exact<{
  companyMemberId: Scalars['ID'];
  input: UploadMemberReferenceImageInput;
}>;


export type CompanyMemberSetReferenceImageMutation = { __typename?: 'Mutation', setCompanyMemberReferenceImage?: { __typename?: 'CompanyMember', id: string, type?: CompanyMemberType | null, position?: string | null, createdAt?: any | null, hourlyRate?: number | null, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, active?: boolean | null } | null, referenceImage?: { __typename?: 'CompanyMemberReferenceImage', imageUrl?: string | null, s3Bucket?: string | null, s3Key?: string | null, status?: CompanyMemberReferenceImageStatus | null, remark?: string | null, actionBy?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null } | null } | null, employeeType?: { __typename?: 'EmployeeType', id: string } | null } | null };

export type GetReferenceImageUploadUrlQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type GetReferenceImageUploadUrlQuery = { __typename?: 'Query', getReferenceImageUploadUrl?: { __typename?: 'CompanyMemberReferenceImageResponse', s3Bucket?: string | null, s3Key?: string | null, uploadUrl?: string | null } | null };

export type AttendanceListPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
  daySummaryInput: AttendanceDaySummaryInput;
  selectedDate: Scalars['DateTime'];
  weekSummaryInput: AttendanceWeekSummaryInput;
  monthSummaryInput: AttendanceMonthSummaryInput;
}>;


export type AttendanceListPageQuery = { __typename?: 'Query', company?: { __typename?: 'Company', id?: string | null, defaultTimezone?: string | null, employeeTypes?: Array<{ __typename?: 'EmployeeType', id: string, name?: string | null, workDaySettings?: Array<{ __typename?: 'CompanyWorkDaySetting', timezone?: string | null } | null> | null } | null> | null, members?: Array<{ __typename?: 'CompanyMember', id: string, position?: string | null, hourlyRate?: number | null, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null, referenceImage?: { __typename?: 'CompanyMemberReferenceImage', status?: CompanyMemberReferenceImageStatus | null, imageUrl?: string | null } | null, employeeType?: { __typename?: 'EmployeeType', id: string, name?: string | null, workDaySettings?: Array<{ __typename?: 'CompanyWorkDaySetting', open?: boolean | null, timezone?: string | null } | null> | null } | null } | null> | null } | null, attendanceDaySummary?: Array<{ __typename?: 'AttendanceDaySummary', tracked?: number | null, regular?: number | null, overtime?: number | null, worked?: number | null, firstAttendance?: { __typename?: 'Attendance', startDate?: any | null, location?: { __typename?: 'Location', name?: string | null } | null } | null, lastAttendance?: { __typename?: 'Attendance', startDate?: any | null, endDate?: any | null, label?: { __typename?: 'AttendanceLabel', name?: string | null, color?: string | null } | null } | null, attendances?: Array<{ __typename?: 'Attendance', comments?: string | null, commentsOut?: string | null, startDate?: any | null, endDate?: any | null, type?: AttendanceType | null, timeTotal?: number | null, label?: { __typename?: 'AttendanceLabel', name?: string | null, color?: string | null } | null, location?: { __typename?: 'Location', name?: string | null } | null } | null> | null, companyMember?: { __typename?: 'CompanyMember', id: string, employeeType?: { __typename?: 'EmployeeType', id: string, name?: string | null, workDaySettings?: Array<{ __typename?: 'CompanyWorkDaySetting', timezone?: string | null } | null> | null } | null, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null } | null> | null, attendanceDaySummaries?: Array<{ __typename?: 'AttendanceDaySummary', day?: number | null, month?: number | null, year?: number | null, tracked?: number | null, overtime?: number | null, firstAttendance?: { __typename?: 'Attendance', startDate?: any | null } | null, lastAttendance?: { __typename?: 'Attendance', endDate?: any | null } | null, companyMember?: { __typename?: 'CompanyMember', id: string, employeeType?: { __typename?: 'EmployeeType', id: string, name?: string | null, workDaySettings?: Array<{ __typename?: 'CompanyWorkDaySetting', open?: boolean | null, timezone?: string | null } | null> | null } | null } | null } | null> | null, attendanceWeekSummary?: Array<{ __typename?: 'AttendanceWeekSummary', trackedTotal?: number | null, monday?: number | null, tuesday?: number | null, wednesday?: number | null, thursday?: number | null, friday?: number | null, saturday?: number | null, sunday?: number | null, companyMember?: { __typename?: 'CompanyMember', id: string, employeeType?: { __typename?: 'EmployeeType', id: string, name?: string | null, workDaySettings?: Array<{ __typename?: 'CompanyWorkDaySetting', timezone?: string | null } | null> | null } | null, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null } | null> | null, attendanceMonthSummary?: Array<{ __typename?: 'AttendanceMonthSummary', trackedTotal?: number | null, companyMember?: { __typename?: 'CompanyMember', id: string, employeeType?: { __typename?: 'EmployeeType', id: string, name?: string | null, workDaySettings?: Array<{ __typename?: 'CompanyWorkDaySetting', open?: boolean | null, timezone?: string | null } | null> | null } | null, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null } | null> | null };

export type CloseAttendanceForUserMutationVariables = Exact<{
  companyMemberId: Scalars['ID'];
}>;


export type CloseAttendanceForUserMutation = { __typename?: 'Mutation', closeAttendanceForUser?: { __typename?: 'Attendance', id: string } | null };

export type TimeEntriesCompanyFragmentFragment = { __typename?: 'Company', id?: string | null, defaultTimezone?: string | null, employeeTypes?: Array<{ __typename?: 'EmployeeType', id: string, name?: string | null, workDaySettings?: Array<{ __typename?: 'CompanyWorkDaySetting', timezone?: string | null } | null> | null } | null> | null, members?: Array<{ __typename?: 'CompanyMember', id: string, position?: string | null, hourlyRate?: number | null, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null, referenceImage?: { __typename?: 'CompanyMemberReferenceImage', status?: CompanyMemberReferenceImageStatus | null, imageUrl?: string | null } | null, employeeType?: { __typename?: 'EmployeeType', id: string, name?: string | null, workDaySettings?: Array<{ __typename?: 'CompanyWorkDaySetting', open?: boolean | null, timezone?: string | null } | null> | null } | null } | null> | null };

export type TimeEntriesAttendanceDaySummariesFragmentFragment = { __typename?: 'AttendanceDaySummary', day?: number | null, month?: number | null, year?: number | null, tracked?: number | null, overtime?: number | null, firstAttendance?: { __typename?: 'Attendance', startDate?: any | null } | null, lastAttendance?: { __typename?: 'Attendance', endDate?: any | null } | null, companyMember?: { __typename?: 'CompanyMember', id: string, employeeType?: { __typename?: 'EmployeeType', id: string, name?: string | null, workDaySettings?: Array<{ __typename?: 'CompanyWorkDaySetting', open?: boolean | null, timezone?: string | null } | null> | null } | null } | null };

export type TimeEntriesAttendanceWeekSummaryFragment = { __typename?: 'AttendanceWeekSummary', trackedTotal?: number | null, monday?: number | null, tuesday?: number | null, wednesday?: number | null, thursday?: number | null, friday?: number | null, saturday?: number | null, sunday?: number | null, companyMember?: { __typename?: 'CompanyMember', id: string, employeeType?: { __typename?: 'EmployeeType', id: string, name?: string | null, workDaySettings?: Array<{ __typename?: 'CompanyWorkDaySetting', timezone?: string | null } | null> | null } | null, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null };

export type TimeEntriesAttendanceMonthSummaryFragment = { __typename?: 'AttendanceMonthSummary', trackedTotal?: number | null, companyMember?: { __typename?: 'CompanyMember', id: string, employeeType?: { __typename?: 'EmployeeType', id: string, name?: string | null, workDaySettings?: Array<{ __typename?: 'CompanyWorkDaySetting', open?: boolean | null, timezone?: string | null } | null> | null } | null, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null };

export type ProjectTimesheetApprovalPageQueryVariables = Exact<{
  projectId: Scalars['ID'];
  dates: Array<TaskQueryTotalRate> | TaskQueryTotalRate;
}>;


export type ProjectTimesheetApprovalPageQuery = { __typename?: 'Query', project?: { __typename?: 'TaskBoard', id?: string | null, name?: string | null, groups?: Array<{ __typename?: 'ProjectGroup', id?: string | null, name?: string | null, tasks?: Array<{ __typename?: 'Task', id: string, name?: string | null, timeSpent?: number | null, totalRate?: number | null, timesheets?: Array<{ __typename?: 'Timesheet', id: string, timeTotal?: number | null, startDate?: any | null, endDate?: any | null, activity?: { __typename?: 'TimesheetActivity', task?: { __typename?: 'Task', id: string } | null } | null } | null> | null, members?: Array<{ __typename?: 'TaskMember', id: string, companyMember?: { __typename?: 'CompanyMember', id: string, hourlyRate?: number | null } | null, user?: { __typename?: 'User', name?: string | null, email?: string | null, profileImage?: string | null } | null } | null> | null, group?: { __typename?: 'ProjectGroup', id?: string | null, name?: string | null } | null, childTasks?: Array<{ __typename?: 'Task', id: string, name?: string | null, timeSpent?: number | null, totalRate?: number | null, timesheets?: Array<{ __typename?: 'Timesheet', id: string, timeTotal?: number | null, startDate?: any | null, endDate?: any | null, activity?: { __typename?: 'TimesheetActivity', task?: { __typename?: 'Task', id: string } | null } | null } | null> | null, members?: Array<{ __typename?: 'TaskMember', id: string, companyMember?: { __typename?: 'CompanyMember', id: string, hourlyRate?: number | null } | null, user?: { __typename?: 'User', name?: string | null, email?: string | null, profileImage?: string | null } | null } | null> | null, group?: { __typename?: 'ProjectGroup', id?: string | null, name?: string | null } | null } | null> | null } | null> | null } | null> | null } | null };

export type TimesheetApprovalPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type TimesheetApprovalPageQuery = { __typename?: 'Query', timesheetApprovals?: Array<{ __typename?: 'TimesheetDayApproval', day?: number | null, month?: number | null, year?: number | null, total?: number | null, status?: TimesheetApprovalStatus | null, billable?: boolean | null, companyMember?: { __typename?: 'CompanyMember', id: string, hourlyRate?: number | null, user?: { __typename?: 'User', name?: string | null, email?: string | null, profileImage?: string | null } | null } | null, task?: { __typename?: 'Task', name?: string | null, id: string, project?: { __typename?: 'TaskBoard', id?: string | null } | null, group?: { __typename?: 'ProjectGroup', id?: string | null, name?: string | null } | null } | null } | null> | null };

export type UpdateTimesheetApprovalsTimesheetApprovalPageMutationVariables = Exact<{
  input: UpdateTimesheetApprovalInput;
}>;


export type UpdateTimesheetApprovalsTimesheetApprovalPageMutation = { __typename?: 'Mutation', updateTimesheetApprovals?: Array<{ __typename?: 'TimesheetDayApproval', total?: number | null } | null> | null };

export type TimesheetMemberApprovalPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type TimesheetMemberApprovalPageQuery = { __typename?: 'Query', timesheetApprovals?: Array<{ __typename?: 'TimesheetDayApproval', day?: number | null, month?: number | null, year?: number | null, total?: number | null, status?: TimesheetApprovalStatus | null, billable?: boolean | null, companyMember?: { __typename?: 'CompanyMember', id: string, hourlyRate?: number | null, user?: { __typename?: 'User', name?: string | null, email?: string | null, profileImage?: string | null } | null } | null, task?: { __typename?: 'Task', name?: string | null, id: string, deletedAt?: any | null, group?: { __typename?: 'ProjectGroup', id?: string | null, name?: string | null } | null, childTasks?: Array<{ __typename?: 'Task', name?: string | null, id: string, deletedAt?: any | null, group?: { __typename?: 'ProjectGroup', id?: string | null, name?: string | null } | null } | null> | null } | null } | null> | null };

export type CustomTimesheetMemberApprovalPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type CustomTimesheetMemberApprovalPageQuery = { __typename?: 'Query', customTimesheetApprovals?: Array<{ __typename?: 'CustomTimesheetDayApproval', day?: number | null, month?: number | null, year?: number | null, total?: number | null, status?: TimesheetApprovalStatus | null, billable?: boolean | null, customName?: string | null, companyMember?: { __typename?: 'CompanyMember', id: string, hourlyRate?: number | null, user?: { __typename?: 'User', name?: string | null, email?: string | null, profileImage?: string | null } | null } | null } | null> | null };

export type TimesheetMemberApprovalProjectsPageQueryVariables = Exact<{
  memberId: Scalars['ID'];
  companyMemberId: Scalars['ID'];
}>;


export type TimesheetMemberApprovalProjectsPageQuery = { __typename?: 'Query', companyMember?: { __typename?: 'CompanyMember', id: string, hourlyRate?: number | null, user?: { __typename?: 'User', name?: string | null, email?: string | null, profileImage?: string | null } | null } | null, projects?: Array<{ __typename?: 'TaskBoard', name?: string | null, groups?: Array<{ __typename?: 'ProjectGroup', id?: string | null, name?: string | null, tasks?: Array<{ __typename?: 'Task', id: string, name?: string | null, timeSpent?: number | null, timesheets?: Array<{ __typename?: 'Timesheet', id: string, timeTotal?: number | null, startDate?: any | null, endDate?: any | null, activity?: { __typename?: 'TimesheetActivity', task?: { __typename?: 'Task', id: string } | null } | null } | null> | null, members?: Array<{ __typename?: 'TaskMember', id: string, companyMember?: { __typename?: 'CompanyMember', id: string, hourlyRate?: number | null } | null, user?: { __typename?: 'User', name?: string | null, email?: string | null, profileImage?: string | null } | null } | null> | null, group?: { __typename?: 'ProjectGroup', id?: string | null, name?: string | null } | null, childTasks?: Array<{ __typename?: 'Task', id: string, name?: string | null, timeSpent?: number | null, timesheets?: Array<{ __typename?: 'Timesheet', id: string, timeTotal?: number | null, startDate?: any | null, endDate?: any | null, activity?: { __typename?: 'TimesheetActivity', task?: { __typename?: 'Task', id: string } | null } | null } | null> | null, members?: Array<{ __typename?: 'TaskMember', id: string, companyMember?: { __typename?: 'CompanyMember', id: string, hourlyRate?: number | null } | null, user?: { __typename?: 'User', name?: string | null, email?: string | null, profileImage?: string | null } | null } | null> | null, group?: { __typename?: 'ProjectGroup', id?: string | null, name?: string | null } | null } | null> | null } | null> | null } | null> | null, tasks?: Array<{ __typename?: 'Task', id: string, name?: string | null, timeSpent?: number | null, timesheets?: Array<{ __typename?: 'Timesheet', id: string, timeTotal?: number | null, startDate?: any | null, endDate?: any | null, activity?: { __typename?: 'TimesheetActivity', task?: { __typename?: 'Task', id: string } | null } | null } | null> | null, members?: Array<{ __typename?: 'TaskMember', id: string, companyMember?: { __typename?: 'CompanyMember', id: string, hourlyRate?: number | null } | null, user?: { __typename?: 'User', name?: string | null, email?: string | null, profileImage?: string | null } | null } | null> | null, group?: { __typename?: 'ProjectGroup', id?: string | null, name?: string | null } | null, childTasks?: Array<{ __typename?: 'Task', id: string, name?: string | null, timeSpent?: number | null, timesheets?: Array<{ __typename?: 'Timesheet', id: string, timeTotal?: number | null, startDate?: any | null, endDate?: any | null, activity?: { __typename?: 'TimesheetActivity', task?: { __typename?: 'Task', id: string } | null } | null } | null> | null, members?: Array<{ __typename?: 'TaskMember', id: string, companyMember?: { __typename?: 'CompanyMember', id: string, hourlyRate?: number | null } | null, user?: { __typename?: 'User', name?: string | null, email?: string | null, profileImage?: string | null } | null } | null> | null, group?: { __typename?: 'ProjectGroup', id?: string | null, name?: string | null } | null } | null> | null } | null> | null } | null> | null };

export type UpdateTimesheetMemberApprovalsTimesheetApprovalPageMutationVariables = Exact<{
  input: UpdateTimesheetApprovalInput;
}>;


export type UpdateTimesheetMemberApprovalsTimesheetApprovalPageMutation = { __typename?: 'Mutation', updateTimesheetApprovals?: Array<{ __typename?: 'TimesheetDayApproval', total?: number | null } | null> | null };

export type UpdateCustomTimesheetMemberApprovalsTimesheetApprovalPageMutationVariables = Exact<{
  input: UpdateCustomTimesheetApprovalInput;
}>;


export type UpdateCustomTimesheetMemberApprovalsTimesheetApprovalPageMutation = { __typename?: 'Mutation', updateCustomTimesheetApprovals?: Array<{ __typename?: 'CustomTimesheetDayApproval', total?: number | null } | null> | null };

export type ProjectsTimesheetTrackingPageQueryVariables = Exact<{
  memberId: Scalars['ID'];
  filters?: InputMaybe<FilterOptions>;
}>;


export type ProjectsTimesheetTrackingPageQuery = { __typename?: 'Query', projects?: Array<{ __typename?: 'TaskBoard', id?: string | null, name?: string | null, archived?: boolean | null, tasks?: Array<{ __typename?: 'Task', id: string, name?: string | null, timeSpent?: number | null, timeSpentMember?: number | null, childTasks?: Array<{ __typename?: 'Task', id: string, name?: string | null, timeSpent?: number | null, timeSpentMember?: number | null } | null> | null } | null> | null } | null> | null };

export type TimesheetsByCompanyMemberQueryVariables = Exact<{
  companyMemberId: Scalars['ID'];
}>;


export type TimesheetsByCompanyMemberQuery = { __typename?: 'Query', getTimesheetsByCompanyMember?: Array<{ __typename?: 'Timesheet', id: string, timeTotal?: number | null, startDate?: any | null, endDate?: any | null, activity?: { __typename?: 'TimesheetActivity', task?: { __typename?: 'Task', id: string, name?: string | null } | null } | null } | null> | null };

export type TimesheetApprovalsTimesheetTrackingPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
  memberId?: InputMaybe<Scalars['ID']>;
}>;


export type TimesheetApprovalsTimesheetTrackingPageQuery = { __typename?: 'Query', timesheetApprovals?: Array<{ __typename?: 'TimesheetDayApproval', day?: number | null, month?: number | null, year?: number | null, total?: number | null, companyMember?: { __typename?: 'CompanyMember', id: string } | null, task?: { __typename?: 'Task', id: string } | null } | null> | null };

export type CustomTimesheetApprovalsTimesheetTrackingPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
  memberId?: InputMaybe<Scalars['ID']>;
}>;


export type CustomTimesheetApprovalsTimesheetTrackingPageQuery = { __typename?: 'Query', customTimesheetApprovals?: Array<{ __typename?: 'CustomTimesheetDayApproval', day?: number | null, month?: number | null, year?: number | null, total?: number | null, customName?: string | null, companyMember?: { __typename?: 'CompanyMember', id: string } | null } | null> | null };

export type CreateTimesheetApprovalsTimesheetTrackingPageMutationVariables = Exact<{
  input: CreateTimesheetApprovalsInput;
}>;


export type CreateTimesheetApprovalsTimesheetTrackingPageMutation = { __typename?: 'Mutation', createTimesheetApprovals?: Array<{ __typename?: 'TimesheetDayApproval', day?: number | null, month?: number | null, year?: number | null, status?: TimesheetApprovalStatus | null, total?: number | null, companyMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', name?: string | null, id?: string | null } | null } | null, task?: { __typename?: 'Task', id: string, name?: string | null } | null } | null> | null };

export type CreateCustomTimesheetApprovalsTimesheetTrackingPageMutationVariables = Exact<{
  input: CreateCustomTimesheetApprovalsInput;
}>;


export type CreateCustomTimesheetApprovalsTimesheetTrackingPageMutation = { __typename?: 'Mutation', createCustomTimesheetApprovals?: Array<{ __typename?: 'CustomTimesheetDayApproval', day?: number | null, month?: number | null, year?: number | null, status?: TimesheetApprovalStatus | null, customName?: string | null, total?: number | null, companyMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', name?: string | null, id?: string | null } | null } | null } | null> | null };

export type DeleteCustomTimesheetApprovalsTimesheetTrackingPageMutationVariables = Exact<{
  input: DeleteCustomTimesheetApprovalsInput;
}>;


export type DeleteCustomTimesheetApprovalsTimesheetTrackingPageMutation = { __typename?: 'Mutation', deleteCustomTimesheetApprovals?: Array<{ __typename?: 'CustomTimesheetDayApproval', day?: number | null, month?: number | null, year?: number | null, status?: TimesheetApprovalStatus | null, customName?: string | null, companyMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', name?: string | null, id?: string | null } | null } | null } | null> | null };

export type CompanyAccountFormCompanyFragmentFragment = { __typename?: 'Company', id?: string | null, name?: string | null, description?: string | null, defaultTimezone?: string | null, logoUrl?: string | null, address?: string | null, email?: string | null, phone?: string | null, website?: string | null, registrationCode?: string | null };

export type CompanyAccountFormUserFragmentFragment = { __typename?: 'User', id?: string | null, defaultCompany?: { __typename?: 'Company', id?: string | null } | null };

export type CompanyAccountPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type CompanyAccountPageQuery = { __typename?: 'Query', company?: { __typename?: 'Company', createdAt?: any | null, id?: string | null, name?: string | null, description?: string | null, defaultTimezone?: string | null, logoUrl?: string | null, address?: string | null, email?: string | null, phone?: string | null, website?: string | null, registrationCode?: string | null, createdBy?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null } | null } | null, currentUser?: { __typename?: 'User', id?: string | null, defaultCompany?: { __typename?: 'Company', id?: string | null } | null } | null };

export type SetDefaultCompanyMutationVariables = Exact<{
  companyId?: InputMaybe<Scalars['ID']>;
}>;


export type SetDefaultCompanyMutation = { __typename?: 'Mutation', setDefaultCompany?: { __typename?: 'User', id?: string | null } | null };

export type DeleteCompanyMutationVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type DeleteCompanyMutation = { __typename?: 'Mutation', deleteCompany?: { __typename?: 'Company', id?: string | null } | null };

export type CompanyActivityLabelsPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type CompanyActivityLabelsPageQuery = { __typename?: 'Query', attendanceLabels?: Array<{ __typename?: 'AttendanceLabel', id: string, name?: string | null, color?: string | null, archived?: boolean | null, description?: string | null } | null> | null };

export type CreateAttendanceLabelMutationVariables = Exact<{
  companyId: Scalars['ID'];
  input: AttendanceLabelInput;
}>;


export type CreateAttendanceLabelMutation = { __typename?: 'Mutation', createAttendanceLabel?: { __typename?: 'AttendanceLabel', id: string } | null };

export type UpdateAttendanceLabelMutationVariables = Exact<{
  labelId: Scalars['ID'];
  input: AttendanceLabelInput;
}>;


export type UpdateAttendanceLabelMutation = { __typename?: 'Mutation', updateAttendanceLabel?: { __typename?: 'AttendanceLabel', id: string } | null };

export type ArchiveAttendanceLabelMutationVariables = Exact<{
  labelId: Scalars['ID'];
  archived: Scalars['Boolean'];
}>;


export type ArchiveAttendanceLabelMutation = { __typename?: 'Mutation', archiveAttendanceLabel?: { __typename?: 'AttendanceLabel', id: string } | null };

export type CompanyHolidayPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
  year: Scalars['Int'];
}>;


export type CompanyHolidayPageQuery = { __typename?: 'Query', holidays?: Array<{ __typename?: 'Holiday', id: string, name?: string | null, type?: string | null, startDate?: any | null, endDate?: any | null, date?: any | null, active?: boolean | null } | null> | null };

export type ActivatePublicHolidayMutationVariables = Exact<{
  companyId: Scalars['ID'];
  holidayId: Scalars['ID'];
}>;


export type ActivatePublicHolidayMutation = { __typename?: 'Mutation', activatePublicHoliday?: { __typename?: 'CompanyHoliday', id: string } | null };

export type DeactivatePublicHolidayMutationVariables = Exact<{
  companyId: Scalars['ID'];
  publicHolidayId: Scalars['ID'];
}>;


export type DeactivatePublicHolidayMutation = { __typename?: 'Mutation', deactivatePublicHoliday?: { __typename?: 'CompanyHoliday', id: string } | null };

export type CreateHolidayMutationVariables = Exact<{
  companyId: Scalars['ID'];
  input: CreateCompanyHolidayInput;
}>;


export type CreateHolidayMutation = { __typename?: 'Mutation', createHoliday?: Array<{ __typename?: 'Holiday', id: string } | null> | null };

export type UpdateCompanyHolidayMutationVariables = Exact<{
  companyId: Scalars['ID'];
  companyHolidayId: Scalars['ID'];
  input: UpdateCompanyHolidayInput;
}>;


export type UpdateCompanyHolidayMutation = { __typename?: 'Mutation', updateCompanyHoliday?: { __typename?: 'CompanyHoliday', id: string } | null };

export type DeleteCompanyHolidayMutationVariables = Exact<{
  companyId: Scalars['ID'];
  companyHolidayId: Scalars['ID'];
}>;


export type DeleteCompanyHolidayMutation = { __typename?: 'Mutation', deleteCompanyHoliday?: { __typename?: 'CompanyHoliday', id: string } | null };

export type CompanyIntegrationPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type CompanyIntegrationPageQuery = { __typename?: 'Query', company?: { __typename?: 'Company', id?: string | null, activeSubscription?: Array<{ __typename?: 'CompanySubscription', id: string, type?: PackageTypes | null } | null> | null, expiredSubscription?: Array<{ __typename?: 'CompanySubscription', id: string, packageTitle?: string | null, type?: PackageTypes | null } | null> | null } | null, currentUser?: { __typename?: 'User', id?: string | null, paymentMethods?: Array<{ __typename?: 'PaymentMethod', id: string, card?: { __typename?: 'PaymentMethodCard', last4?: string | null, expMonth?: number | null, expYear?: number | null, exp_month?: number | null, exp_year?: number | null } | null } | null> | null } | null, subscriptionPackages?: Array<{ __typename?: 'SubscriptionPackage', id: string, title?: string | null, type?: PackageTypes | null, emailQuota?: number | null, whatsappQuota?: number | null, packagePrices?: Array<{ __typename?: 'SubscriptionPackagePrice', id: string, currency?: string | null, interval?: string | null, price?: number | null } | null> | null } | null> | null, dedocoPackages?: Array<{ __typename?: 'SubscriptionPackage', id: string, title?: string | null, type?: PackageTypes | null, signatureQuota?: number | null, packagePrices?: Array<{ __typename?: 'SubscriptionPackagePrice', id: string, name?: string | null, price?: number | null, currency?: string | null } | null> | null } | null> | null };

export type RequestDedocoSubscriptionMutationVariables = Exact<{
  companyId: Scalars['ID'];
  packagePriceId: Scalars['ID'];
}>;


export type RequestDedocoSubscriptionMutation = { __typename?: 'Mutation', requestDedocoSubscription?: { __typename?: 'CompanySubscription', id: string } | null };

export type CompanyInvoiceSettingsPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type CompanyInvoiceSettingsPageQuery = { __typename?: 'Query', company?: { __typename?: 'Company', id?: string | null, invoicePrefix?: string | null, invoiceStart?: number | null } | null };

export type CompanyLocationsPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type CompanyLocationsPageQuery = { __typename?: 'Query', locations?: Array<{ __typename?: 'Location', id: string, name?: string | null, address?: string | null, radius?: number | null, lng?: number | null, lat?: number | null, archived?: boolean | null } | null> | null };

export type CreateLocationMutationVariables = Exact<{
  companyId: Scalars['ID'];
  input: CreateLocationInput;
}>;


export type CreateLocationMutation = { __typename?: 'Mutation', createLocation?: { __typename?: 'Location', id: string } | null };

export type UpdateLocationMutationVariables = Exact<{
  locationId: Scalars['ID'];
  input: UpdateLocationInput;
}>;


export type UpdateLocationMutation = { __typename?: 'Mutation', updateLocation?: { __typename?: 'Location', id: string } | null };

export type DeleteLocationsMutationVariables = Exact<{
  locationIds: Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>;
}>;


export type DeleteLocationsMutation = { __typename?: 'Mutation', deleteLocations?: Array<{ __typename?: 'Location', id: string } | null> | null };

export type UpdateLocationArchivedStatusMutationVariables = Exact<{
  locationIds: Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>;
  archived: Scalars['Boolean'];
}>;


export type UpdateLocationArchivedStatusMutation = { __typename?: 'Mutation', updateLocationArchivedStatus?: Array<{ __typename?: 'Location', id: string } | null> | null };

export type CompanyMembersPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type CompanyMembersPageQuery = { __typename?: 'Query', company?: { __typename?: 'Company', id?: string | null, members?: Array<{ __typename?: 'CompanyMember', id: string, hourlyRate?: number | null, createdAt?: any | null, type?: CompanyMemberType | null, position?: string | null, active?: boolean | null, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, contactNo?: string | null } | null, referenceImage?: { __typename?: 'CompanyMemberReferenceImage', imageUrl?: string | null, status?: CompanyMemberReferenceImageStatus | null } | null, employeeType?: { __typename?: 'EmployeeType', id: string, name?: string | null } | null } | null> | null, employeeTypes?: Array<{ __typename?: 'EmployeeType', id: string, name?: string | null, archived?: boolean | null } | null> | null } | null };

export type BulkUploadMembersMutationVariables = Exact<{
  companyId: Scalars['ID'];
  attachment: Scalars['Upload'];
}>;


export type BulkUploadMembersMutation = { __typename?: 'Mutation', bulkUploadMembers?: { __typename?: 'BulkUploadMembersResponse', duplicateEmails?: number | null } | null };

export type UpdateCompanyMemberInfoMutationVariables = Exact<{
  companyMemberId: Scalars['ID'];
  input: UpdateCompanyMemberInfoInput;
}>;


export type UpdateCompanyMemberInfoMutation = { __typename?: 'Mutation', updateCompanyMemberInfo?: { __typename?: 'CompanyMember', id: string, type?: CompanyMemberType | null } | null };

export type RemoveMemberFromCompanyMutationVariables = Exact<{
  companyId: Scalars['ID'];
  companyMemberId: Scalars['ID'];
}>;


export type RemoveMemberFromCompanyMutation = { __typename?: 'Mutation', removeMemberFromCompany?: { __typename?: 'Company', id?: string | null } | null };

export type SetCompanyMemberReferenceImageMutationVariables = Exact<{
  companyMemberId: Scalars['ID'];
  input: UploadMemberReferenceImageInput;
}>;


export type SetCompanyMemberReferenceImageMutation = { __typename?: 'Mutation', setCompanyMemberReferenceImage?: { __typename?: 'CompanyMember', id: string } | null };

export type UpdateCompanyMemberActiveStatusMutationVariables = Exact<{
  companyMemberId: Scalars['ID'];
  active: Scalars['Boolean'];
}>;


export type UpdateCompanyMemberActiveStatusMutation = { __typename?: 'Mutation', updateCompanyMemberActiveStatus?: { __typename?: 'CompanyMember', id: string } | null };

export type EditCompanyMemberDrawerFragmentFragment = { __typename?: 'CompanyMember', id: string, active?: boolean | null, employeeType?: { __typename?: 'EmployeeType', id: string, name?: string | null } | null };

export type CompanyPaymentPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type CompanyPaymentPageQuery = { __typename?: 'Query', companyPaymentMethods?: Array<{ __typename?: 'CompanyPaymentMethod', isDefault?: boolean | null, stripePaymentMethodId?: string | null, brand?: string | null, expMonth?: string | null, expYear?: string | null, last4?: string | null } | null> | null };

export type DeleteCompanyPaymentMethodMutationVariables = Exact<{
  input: DeleteCompanyPaymentMethodInput;
}>;


export type DeleteCompanyPaymentMethodMutation = { __typename?: 'Mutation', deleteCompanyPaymentMethod?: { __typename?: 'DeleteCompanyPaymentMethodResponse', success?: boolean | null } | null };

export type SetDefaultCompanyPaymentMethodMutationVariables = Exact<{
  input: SetDefaultCompanyPaymentMethodInput;
}>;


export type SetDefaultCompanyPaymentMethodMutation = { __typename?: 'Mutation', setDefaultCompanyPaymentMethod?: { __typename?: 'CompanyPaymentMethod', isDefault?: boolean | null } | null };

export type AttendanceSettingsFragmentFragment = { __typename?: 'AttendanceSettings', allow_mobile?: boolean | null, allow_web?: boolean | null, require_verification?: boolean | null, require_location?: boolean | null, enable_2d?: boolean | null, enable_biometric?: boolean | null };

export type CompanyPoliciesPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type CompanyPoliciesPageQuery = { __typename?: 'Query', attendanceSettings?: { __typename?: 'AttendanceSettings', allow_mobile?: boolean | null, allow_web?: boolean | null, require_verification?: boolean | null, require_location?: boolean | null, enable_2d?: boolean | null, enable_biometric?: boolean | null } | null };

export type UpdateAttendanceSettingsMutationVariables = Exact<{
  companyId: Scalars['ID'];
  input: UpdateAttendanceSettingsInput;
}>;


export type UpdateAttendanceSettingsMutation = { __typename?: 'Mutation', updateAttendanceSettings?: { __typename?: 'AttendanceSettings', allow_mobile?: boolean | null, allow_web?: boolean | null, require_verification?: boolean | null, require_location?: boolean | null, enable_2d?: boolean | null, enable_biometric?: boolean | null } | null };

export type CompanySubscriptionInfoPageQueryVariables = Exact<{
  subscriptionId: Scalars['ID'];
  companyId: Scalars['ID'];
}>;


export type CompanySubscriptionInfoPageQuery = { __typename?: 'Query', companySubscription?: { __typename?: 'CompanySubscription', id: string, packageTitle?: string | null, interval?: string | null, price?: number | null, endDate?: any | null, quantity?: number | null, type?: PackageTypes | null, productId?: string | null, cancelDate?: any | null, status?: SubscriptionStatuses | null, signatureQuota?: number | null, whiteListedMembers?: { __typename?: 'SubscriptionQuantityResult', total?: number | null, assigned?: number | null, companyMembers?: Array<{ __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, contactNo?: string | null, profileImage?: string | null } | null } | null> | null } | null, subscriptionPackagePrice?: { __typename?: 'SubscriptionPackagePrice', id: string, currency?: string | null } | null, discount?: { __typename?: 'SubscriptionDiscount', id?: string | null, coupon?: { __typename?: 'StripeCoupon', id?: string | null, percentOff?: number | null, amountOff?: number | null } | null } | null, package?: { __typename?: 'SubscriptionPackage', id: string, signatureQuota?: number | null } | null } | null, company?: { __typename?: 'Company', id?: string | null, members?: Array<{ __typename?: 'CompanyMember', id: string, hourlyRate?: number | null, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null> | null, activeSubscription?: Array<{ __typename?: 'CompanySubscription', id: string, type?: PackageTypes | null, cancelDate?: any | null } | null> | null } | null, companyStorage?: { __typename?: 'CompanyStorageDetails', totalUsageInKB?: number | null } | null, subscriptionPackages?: Array<{ __typename?: 'SubscriptionPackage', id: string, title?: string | null, type?: PackageTypes | null, packagePrices?: Array<{ __typename?: 'SubscriptionPackagePrice', id: string, currency?: string | null, price?: number | null, interval?: string | null } | null> | null } | null> | null };

export type EditPackageQuantityMutationVariables = Exact<{
  companyId: Scalars['ID'];
  companySubscriptionId: Scalars['ID'];
  quantity: Scalars['Int'];
}>;


export type EditPackageQuantityMutation = { __typename?: 'Mutation', editPackageQuantity?: { __typename?: 'CompanySubscription', id: string } | null };

export type RemovePackagesFromSubscriptionMutationVariables = Exact<{
  companyId: Scalars['ID'];
  companySubscriptionIds: Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>;
}>;


export type RemovePackagesFromSubscriptionMutation = { __typename?: 'Mutation', removePackagesFromSubscription?: Array<{ __typename?: 'CompanySubscription', id: string } | null> | null };

export type SwitchSubscriptionPackageMutationVariables = Exact<{
  companyId: Scalars['ID'];
  switchSubscriptionPackageInput: SwitchSubscriptionPackageInput;
  companySubscriptionId: Scalars['ID'];
}>;


export type SwitchSubscriptionPackageMutation = { __typename?: 'Mutation', switchSubscriptionPackage?: { __typename?: 'CompanySubscription', id: string } | null };

export type CancelAllSubscriptionsMutationVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type CancelAllSubscriptionsMutation = { __typename?: 'Mutation', cancelAllSubscriptions?: Array<{ __typename?: 'CompanySubscription', id: string } | null> | null };

export type CompanySubscriptionsPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type CompanySubscriptionsPageQuery = { __typename?: 'Query', company?: { __typename?: 'Company', id?: string | null, currentSubscription?: { __typename?: 'Subscription', id: string, intervalType?: SubscriptionPriceInterval | null, stripeSubscriptionId?: string | null, package?: { __typename?: 'SubscriptionPackage', id: string, sequence?: number | null, name?: string | null } | null, upcomingChanges?: Array<{ __typename?: 'SubscriptionChange', action?: string | null, actionData?: any | null, runAt?: any | null } | null> | null } | null } | null, subscriptionPackagesV2?: Array<{ __typename?: 'SubscriptionPackage', id: string, name?: string | null, isDefault?: boolean | null, sequence?: number | null, userQuota?: number | null, taskQuota?: number | null, teamQuota?: number | null, products?: Array<{ __typename?: 'SubscriptionProduct', id: string, prices?: Array<{ __typename?: 'SubscriptionPrice', amount?: number | null, interval?: string | null } | null> | null } | null> | null } | null> | null };

export type UpgradeSubscriptionMutationVariables = Exact<{
  input: UpgradeSubscriptionInput;
}>;


export type UpgradeSubscriptionMutation = { __typename?: 'Mutation', upgradeSubscription?: { __typename?: 'Subscription', id: string } | null };

export type DowngradeSubscriptionMutationVariables = Exact<{
  input: DowngradeSubscriptionInput;
}>;


export type DowngradeSubscriptionMutation = { __typename?: 'Mutation', downgradeSubscription?: { __typename?: 'Subscription', id: string } | null };

export type CancelSubscriptionV2MutationVariables = Exact<{
  input: CancelSubscriptionInput;
}>;


export type CancelSubscriptionV2Mutation = { __typename?: 'Mutation', cancelSubscriptionV2?: { __typename?: 'Subscription', id: string } | null };

export type TagFragmentFragment = { __typename?: 'Tag', id?: string | null, name?: string | null, color?: string | null };

export type CompanyTagGroupPageQueryVariables = Exact<{
  tagGroupId: Scalars['ID'];
}>;


export type CompanyTagGroupPageQuery = { __typename?: 'Query', tagGroup?: { __typename?: 'TagGroup', id?: string | null, name?: string | null, description?: string | null, tags?: Array<{ __typename?: 'Tag', id?: string | null, name?: string | null, color?: string | null } | null> | null } | null };

export type CreateTagMutationVariables = Exact<{
  input: CreateTagInput;
}>;


export type CreateTagMutation = { __typename?: 'Mutation', createTag?: { __typename?: 'Tag', id?: string | null } | null };

export type UpdateTagMutationVariables = Exact<{
  input: UpdateTagInput;
}>;


export type UpdateTagMutation = { __typename?: 'Mutation', updateTag?: { __typename?: 'Tag', id?: string | null, name?: string | null, color?: string | null } | null };

export type DeleteTagMutationVariables = Exact<{
  deleteTagId: Scalars['ID'];
}>;


export type DeleteTagMutation = { __typename?: 'Mutation', deleteTag?: { __typename?: 'Tag', id?: string | null } | null };

export type UpdateTagGroupMutationVariables = Exact<{
  input: UpdateTagGroupInput;
}>;


export type UpdateTagGroupMutation = { __typename?: 'Mutation', updateTagGroup?: { __typename?: 'TagGroup', id?: string | null } | null };

export type CompanyTagsPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type CompanyTagsPageQuery = { __typename?: 'Query', tagGroups?: Array<{ __typename?: 'TagGroup', id?: string | null, name?: string | null, tags?: Array<{ __typename?: 'Tag', id?: string | null, name?: string | null, color?: string | null } | null> | null } | null> | null };

export type CreateTagGroupMutationVariables = Exact<{
  input: CreateTagGroupInput;
}>;


export type CreateTagGroupMutation = { __typename?: 'Mutation', createTagGroup?: { __typename?: 'TagGroup', id?: string | null } | null };

export type DeleteTagGroupMutationVariables = Exact<{
  deleteTagGroupId: Scalars['ID'];
}>;


export type DeleteTagGroupMutation = { __typename?: 'Mutation', deleteTagGroup?: { __typename?: 'TagGroup', id?: string | null } | null };

export type CompanyTeamInfoPageQueryVariables = Exact<{
  companyTeamId: Scalars['ID'];
  companyId: Scalars['ID'];
}>;


export type CompanyTeamInfoPageQuery = { __typename?: 'Query', companyTeam?: { __typename?: 'CompanyTeam', id: string, title?: string | null, members?: Array<{ __typename?: 'CompanyMember', id: string, type?: CompanyMemberType | null, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null, contactNo?: string | null } | null, referenceImage?: { __typename?: 'CompanyMemberReferenceImage', imageUrl?: string | null, status?: CompanyMemberReferenceImageStatus | null } | null } | null> | null } | null, company?: { __typename?: 'Company', id?: string | null, members?: Array<{ __typename?: 'CompanyMember', id: string, hourlyRate?: number | null, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null> | null } | null };

export type RemoveMemberFromCompanyTeamMutationVariables = Exact<{
  companyTeamId: Scalars['ID'];
  teamMemberId: Scalars['ID'];
}>;


export type RemoveMemberFromCompanyTeamMutation = { __typename?: 'Mutation', removeMemberFromCompanyTeam?: { __typename?: 'CompanyTeam', id: string } | null };

export type UpdateCompanyTeamInfoMutationVariables = Exact<{
  companyTeamId: Scalars['ID'];
  input: UpdateCompanyTeamInfoInput;
}>;


export type UpdateCompanyTeamInfoMutation = { __typename?: 'Mutation', updateCompanyTeamInfo?: { __typename?: 'CompanyTeam', id: string } | null };

export type CompanyTeamInfoPageBulkUploadMembersMutationVariables = Exact<{
  companyId: Scalars['ID'];
  attachment: Scalars['Upload'];
}>;


export type CompanyTeamInfoPageBulkUploadMembersMutation = { __typename?: 'Mutation', bulkUploadMembers?: { __typename?: 'BulkUploadMembersResponse', duplicateEmails?: number | null, companyMembers?: Array<{ __typename?: 'CompanyMember', id: string } | null> | null } | null };

export type CompanyTeamsPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type CompanyTeamsPageQuery = { __typename?: 'Query', company?: { __typename?: 'Company', id?: string | null, teams?: Array<{ __typename?: 'CompanyTeam', id: string, title?: string | null, members?: Array<{ __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null> | null } | null> | null, members?: Array<{ __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null } | null } | null> | null } | null };

export type CreateCompanyTeamMutationVariables = Exact<{
  companyId: Scalars['ID'];
  input: CreateCompanyTeamInput;
}>;


export type CreateCompanyTeamMutation = { __typename?: 'Mutation', createCompanyTeam?: { __typename?: 'CompanyTeam', id: string } | null };

export type DeleteCompanyTeamMutationVariables = Exact<{
  teamId: Scalars['ID'];
}>;


export type DeleteCompanyTeamMutation = { __typename?: 'Mutation', deleteCompanyTeam?: { __typename?: 'CompanyTeam', id: string } | null };

export type EditTeamModalFragmentFragment = { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null } | null };

export type CompanyWorkScheduleInfoPageQueryVariables = Exact<{
  employeeTypeId: Scalars['ID'];
}>;


export type CompanyWorkScheduleInfoPageQuery = { __typename?: 'Query', employeeType?: { __typename?: 'EmployeeType', id: string, name?: string | null, hasOvertime?: boolean | null, workDaySettings?: Array<{ __typename?: 'CompanyWorkDaySetting', day?: WorkDay | null, open?: boolean | null, startHour?: string | null, endHour?: string | null, timezone?: string | null } | null> | null } | null };

export type UpdateEmployeeTypeMutationVariables = Exact<{
  typeId: Scalars['ID'];
  name: Scalars['String'];
  overtime: Scalars['Boolean'];
}>;


export type UpdateEmployeeTypeMutation = { __typename?: 'Mutation', updateEmployeeType?: { __typename?: 'EmployeeType', id: string } | null };

export type UpdateCompanyWorkDaySettingMutationVariables = Exact<{
  companyId: Scalars['ID'];
  day: WorkDay;
  employeeTypeId: Scalars['ID'];
  input: UpdateCompanyWorkDayInput;
}>;


export type UpdateCompanyWorkDaySettingMutation = { __typename?: 'Mutation', updateCompanyWorkDaySetting?: { __typename?: 'CompanyWorkDaySetting', day?: WorkDay | null } | null };

export type ArchiveEmployeeTypeMutationVariables = Exact<{
  typeId: Scalars['ID'];
  archived: Scalars['Boolean'];
}>;


export type ArchiveEmployeeTypeMutation = { __typename?: 'Mutation', archiveEmployeeType?: { __typename?: 'EmployeeType', id: string } | null };

export type EditWorkScheduleFormFragmentFragment = { __typename?: 'EmployeeType', id: string, name?: string | null, hasOvertime?: boolean | null, workDaySettings?: Array<{ __typename?: 'CompanyWorkDaySetting', day?: WorkDay | null, open?: boolean | null, startHour?: string | null, endHour?: string | null, timezone?: string | null } | null> | null };

export type CompanyWorkSchedulesPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type CompanyWorkSchedulesPageQuery = { __typename?: 'Query', company?: { __typename?: 'Company', id?: string | null, employeeTypes?: Array<{ __typename?: 'EmployeeType', id: string, name?: string | null, archived?: boolean | null, workDaySettings?: Array<{ __typename?: 'CompanyWorkDaySetting', timezone?: string | null } | null> | null } | null> | null } | null };

export type CreateEmployeeTypeMutationVariables = Exact<{
  companyId: Scalars['ID'];
  name: Scalars['String'];
  overtime: Scalars['Boolean'];
  timezone?: InputMaybe<Scalars['String']>;
}>;


export type CreateEmployeeTypeMutation = { __typename?: 'Mutation', createEmployeeType?: { __typename?: 'EmployeeType', id: string } | null };

export type ContactAttachmentPanelFragmentFragment = { __typename?: 'Task', id: string, attachments?: Array<{ __typename?: 'TaskAttachment', id: string, name?: string | null, fileSize?: number | null, createdAt?: any | null, createdBy?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null> | null };

export type DeleteTaskAttachmentsMutationVariables = Exact<{
  taskAttachmentIds: Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>;
}>;


export type DeleteTaskAttachmentsMutation = { __typename?: 'Mutation', deleteTaskAttachments?: Array<{ __typename?: 'TaskAttachment', id: string } | null> | null };

export type ContactInfoPageQueryVariables = Exact<{
  contactId: Scalars['ID'];
  companyId: Scalars['ID'];
  filters?: InputMaybe<FilterOptions>;
}>;


export type ContactInfoPageQuery = { __typename?: 'Query', contact?: { __typename?: 'Contact', id: string, name?: string | null, address?: string | null, remarks?: string | null, type?: ContactType | null, dealValue?: number | null, createdAt?: any | null, accountCode?: string | null, dealCreator?: { __typename?: 'User', id?: string | null } | null, groups?: Array<{ __typename?: 'ContactGroup', id: string } | null> | null, tags?: Array<{ __typename?: 'Tag', id?: string | null } | null> | null, pics?: Array<{ __typename?: 'ContactPic', id: string, name?: string | null, remarks?: string | null, contactNo?: string | null, user?: { __typename?: 'User', id?: string | null, email?: string | null } | null } | null> | null, taskBoards?: Array<{ __typename?: 'TaskBoard', id?: string | null, category?: TaskBoardCategory | null, tasks?: Array<{ __typename?: 'Task', id: string, name?: string | null, dueDate?: any | null, archived?: boolean | null, startDate?: any | null, endDate?: any | null, members?: Array<{ __typename?: 'TaskMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null> | null, attachments?: Array<{ __typename?: 'TaskAttachment', id: string, name?: string | null, fileSize?: number | null, createdAt?: any | null, createdBy?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null> | null, projectStatus?: { __typename?: 'ProjectStatus', id?: string | null, color?: string | null, name?: string | null } | null, comments?: Array<{ __typename?: 'TaskComment', id: string } | null> | null, checklists?: Array<{ __typename?: 'Checklist', id: string } | null> | null, project?: { __typename?: 'TaskBoard', id?: string | null, name?: string | null } | null } | null> | null } | null> | null, notes?: Array<{ __typename?: 'ContactNote', id?: string | null, noteContent?: string | null, content?: string | null, date?: any | null, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null> | null } | null, tagGroups?: Array<{ __typename?: 'TagGroup', id?: string | null, name?: string | null, tags?: Array<{ __typename?: 'Tag', id?: string | null, name?: string | null, color?: string | null } | null> | null } | null> | null, contactGroups?: Array<{ __typename?: 'ContactGroup', id: string, name?: string | null } | null> | null };

export type ContactActivitiesQueryVariables = Exact<{
  contactId: Scalars['ID'];
  tableType: ContactActivityTableType;
  limit: Scalars['Int'];
  isCount: Scalars['Boolean'];
  offset: Scalars['Int'];
}>;


export type ContactActivitiesQuery = { __typename?: 'Query', contactActivities?: Array<{ __typename?: 'ContactActivityRaw', action?: string | null, timestamp?: any | null, previousValues?: string | null, currentValues?: string | null, changedValues?: string | null } | null> | null };

export type UpdateContactMutationVariables = Exact<{
  companyId: Scalars['ID'];
  contactId: Scalars['ID'];
  input: UpdateContactInput;
  contactGroupId?: InputMaybe<Scalars['ID']>;
  dealCreator?: InputMaybe<Scalars['ID']>;
}>;


export type UpdateContactMutation = { __typename?: 'Mutation', updateContact?: { __typename?: 'Contact', id: string } | null };

export type DeleteContactsMutationVariables = Exact<{
  companyId: Scalars['ID'];
  contactIds: Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>;
}>;


export type DeleteContactsMutation = { __typename?: 'Mutation', deleteContacts?: Array<{ __typename?: 'Contact', id: string } | null> | null };

export type AssignContactTagsMutationVariables = Exact<{
  input: ContactTagOptions;
}>;


export type AssignContactTagsMutation = { __typename?: 'Mutation', assignContactTags?: Array<{ __typename?: 'ContactTag', tag?: { __typename?: 'Tag', id?: string | null } | null } | null> | null };

export type DeleteContactTagsMutationVariables = Exact<{
  input: ContactTagOptions;
}>;


export type DeleteContactTagsMutation = { __typename?: 'Mutation', deleteContactTags?: Array<{ __typename?: 'ContactTag', tag?: { __typename?: 'Tag', id?: string | null } | null } | null> | null };

export type ContactNotePanelFragmentFragment = { __typename?: 'ContactNote', id?: string | null, noteContent?: string | null, content?: string | null, date?: any | null, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null };

export type CreateContactNoteMutationVariables = Exact<{
  contactId: Scalars['ID'];
  input: ContactNoteInput;
}>;


export type CreateContactNoteMutation = { __typename?: 'Mutation', createContactNote?: { __typename?: 'ContactNote', id?: string | null } | null };

export type UpdateContactNoteMutationVariables = Exact<{
  contactNoteId: Scalars['ID'];
  input: ContactNoteInput;
}>;


export type UpdateContactNoteMutation = { __typename?: 'Mutation', updateContactNote?: { __typename?: 'ContactNote', id?: string | null } | null };

export type DeleteContactNotesMutationVariables = Exact<{
  contactNoteIds: Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>;
}>;


export type DeleteContactNotesMutation = { __typename?: 'Mutation', deleteContactNotes?: Array<{ __typename?: 'ContactNote', id?: string | null } | null> | null };

export type ContactPicPanelFragmentFragment = { __typename?: 'ContactPic', id: string, name?: string | null, remarks?: string | null, contactNo?: string | null, user?: { __typename?: 'User', id?: string | null, email?: string | null } | null };

export type UpdateContactPicMutationVariables = Exact<{
  companyId: Scalars['ID'];
  picId: Scalars['ID'];
  input: UpdateContactPicInput;
}>;


export type UpdateContactPicMutation = { __typename?: 'Mutation', updateContactPic?: { __typename?: 'ContactPic', id: string } | null };

export type DeleteContactPicMutationVariables = Exact<{
  companyId: Scalars['ID'];
  picId: Scalars['ID'];
}>;


export type DeleteContactPicMutation = { __typename?: 'Mutation', deleteContactPic?: { __typename?: 'DeleteContactPicResponse', contact?: { __typename?: 'Contact', id: string } | null } | null };

export type ContactTaskPanelFragmentFragment = { __typename?: 'Task', id: string, name?: string | null, dueDate?: any | null, archived?: boolean | null, startDate?: any | null, endDate?: any | null, members?: Array<{ __typename?: 'TaskMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null> | null, projectStatus?: { __typename?: 'ProjectStatus', id?: string | null, color?: string | null, name?: string | null } | null, comments?: Array<{ __typename?: 'TaskComment', id: string } | null> | null, checklists?: Array<{ __typename?: 'Checklist', id: string } | null> | null, attachments?: Array<{ __typename?: 'TaskAttachment', id: string } | null> | null, project?: { __typename?: 'TaskBoard', id?: string | null, name?: string | null } | null };

export type ContactListPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type ContactListPageQuery = { __typename?: 'Query', contactGroups?: Array<{ __typename?: 'ContactGroup', id: string, name?: string | null, contacts?: Array<{ __typename?: 'Contact', id: string, name?: string | null, type?: ContactType | null, dealValue?: number | null, createdAt?: any | null, pics?: Array<{ __typename?: 'ContactPic', id: string } | null> | null, dealCreator?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null, tags?: Array<{ __typename?: 'Tag', id?: string | null } | null> | null } | null> | null } | null> | null, tagGroups?: Array<{ __typename?: 'TagGroup', id?: string | null, name?: string | null, tags?: Array<{ __typename?: 'Tag', id?: string | null, name?: string | null } | null> | null } | null> | null };

export type CreateContactGroupMutationVariables = Exact<{
  companyId: Scalars['ID'];
  input: CreateContactGroupInput;
}>;


export type CreateContactGroupMutation = { __typename?: 'Mutation', createContactGroup?: { __typename?: 'ContactGroup', id: string } | null };

export type UpdateContactGroupMutationVariables = Exact<{
  groupId: Scalars['ID'];
  input: UpdateContactGroupInput;
}>;


export type UpdateContactGroupMutation = { __typename?: 'Mutation', updateContactGroup?: { __typename?: 'ContactGroup', id: string, name?: string | null } | null };

export type DeleteContactGroupMutationVariables = Exact<{
  groupId: Scalars['ID'];
}>;


export type DeleteContactGroupMutation = { __typename?: 'Mutation', deleteContactGroup?: { __typename?: 'ContactGroup', id: string } | null };

export type BulkUploadContactsMutationVariables = Exact<{
  companyId: Scalars['ID'];
  attachment: Scalars['Upload'];
  groupId?: InputMaybe<Scalars['ID']>;
}>;


export type BulkUploadContactsMutation = { __typename?: 'Mutation', bulkUploadContacts?: { __typename?: 'BulkUploadContactsResponse', contacts?: Array<{ __typename?: 'Contact', id: string } | null> | null } | null };

export type AddMembersToContactGroupMutationVariables = Exact<{
  input: AddMembersToContactGroupInput;
  groupId?: InputMaybe<Scalars['ID']>;
}>;


export type AddMembersToContactGroupMutation = { __typename?: 'Mutation', addMembersToContactGroup?: Array<{ __typename?: 'Contact', id: string } | null> | null };

export type ReportFormPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
  type: TaskBoardType;
}>;


export type ReportFormPageQuery = { __typename?: 'Query', company?: { __typename?: 'Company', id?: string | null, teams?: Array<{ __typename?: 'CompanyTeam', id: string, title?: string | null } | null> | null, members?: Array<{ __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null } | null } | null> | null, employeeTypes?: Array<{ __typename?: 'EmployeeType', id: string, name?: string | null, archived?: boolean | null } | null> | null } | null, contacts?: Array<{ __typename?: 'Contact', id: string, name?: string | null } | null> | null, tagGroups?: Array<{ __typename?: 'TagGroup', id?: string | null, name?: string | null, tags?: Array<{ __typename?: 'Tag', id?: string | null, name?: string | null } | null> | null } | null> | null, attendanceLabels?: Array<{ __typename?: 'AttendanceLabel', id: string, name?: string | null } | null> | null, taskBoards?: Array<{ __typename?: 'TaskBoard', id?: string | null, name?: string | null, owners?: Array<{ __typename?: 'TaskBoardOwner', companyMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null } | null } | null } | null> | null } | null> | null };

export type PreTaskModalPageQueryVariables = Exact<{
  taskId: Scalars['ID'];
}>;


export type PreTaskModalPageQuery = { __typename?: 'Query', task?: { __typename?: 'Task', id: string, project?: { __typename?: 'TaskBoard', id?: string | null } | null } | null };

export type ProjectArchivedTasksPageQueryVariables = Exact<{
  companyId: Scalars['ID'];
  projectId: Scalars['ID'];
}>;


export type ProjectArchivedTasksPageQuery = { __typename?: 'Query', companyTeams?: Array<{ __typename?: 'CompanyTeam', id: string, title?: string | null } | null> | null, project?: { __typename?: 'TaskBoard', id?: string | null, name?: string | null, visibility?: CommonVisibility | null, workspace?: { __typename?: 'Workspace', id?: string | null } | null, projectSettings?: { __typename?: 'ProjectSettings', columns?: any | null } | null, projectStatuses?: Array<{ __typename?: 'ProjectStatus', id?: string | null, color?: string | null, name?: string | null, notify?: boolean | null } | null> | null, owners?: Array<{ __typename?: 'TaskBoardOwner', companyMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null } | null } | null } | null> | null, visibilityWhitelist?: { __typename?: 'CommonVisibilityWhitelist', teams?: Array<{ __typename?: 'CompanyTeam', id: string } | null> | null, members?: Array<{ __typename?: 'CompanyMember', id: string } | null> | null } | null, tasks?: Array<{ __typename?: 'Task', id: string, name?: string | null, archived?: boolean | null, archivedAt?: any | null, archivedBy?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null } | null, group?: { __typename?: 'ProjectGroup', id?: string | null, name?: string | null } | null, childTasks?: Array<{ __typename?: 'Task', id: string, name?: string | null, archived?: boolean | null, archivedAt?: any | null, archivedBy?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null } | null, parentTask?: { __typename?: 'Task', id: string, group?: { __typename?: 'ProjectGroup', id?: string | null, name?: string | null } | null } | null } | null> | null } | null> | null, createdBy?: { __typename?: 'User', id?: string | null } | null } | null };

export type UnarchiveTasksMutationVariables = Exact<{
  input: UnarchiveTaskInput;
}>;


export type UnarchiveTasksMutation = { __typename?: 'Mutation', unarchiveTasks?: Array<{ __typename?: 'Task', id: string } | null> | null };

export type CreateBillingInvoiceMutationVariables = Exact<{
  input: CreateBillingInvoiceInput;
}>;


export type CreateBillingInvoiceMutation = { __typename?: 'Mutation', createBillingInvoice?: { __typename?: 'BillingInvoice', id?: string | null } | null };

export type UpdateBillingInvoiceMutationVariables = Exact<{
  input: UpdateBillingInvoiceInput;
}>;


export type UpdateBillingInvoiceMutation = { __typename?: 'Mutation', updateBillingInvoice?: { __typename?: 'BillingInvoice', id?: string | null } | null };

export type DeleteBillingInvoicesMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type DeleteBillingInvoicesMutation = { __typename?: 'Mutation', deleteBillingInvoices?: Array<{ __typename?: 'BillingInvoice', id?: string | null } | null> | null };

export type CreateBillingInvoiceItemMutationVariables = Exact<{
  input: CreateBillingInvoiceItemInput;
}>;


export type CreateBillingInvoiceItemMutation = { __typename?: 'Mutation', createBillingInvoiceItem?: { __typename?: 'BillingInvoiceItem', id?: string | null } | null };

export type UpdateBillingInvoiceItemMutationVariables = Exact<{
  input: UpdateBillingInvoiceItemInput;
}>;


export type UpdateBillingInvoiceItemMutation = { __typename?: 'Mutation', updateBillingInvoiceItem?: { __typename?: 'BillingInvoiceItem', id?: string | null } | null };

export type DeleteBillingInvoiceItemsMutationVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type DeleteBillingInvoiceItemsMutation = { __typename?: 'Mutation', deleteBillingInvoiceItems?: { __typename?: 'BillingInvoiceItem', id?: string | null } | null };

export type ReceivePaymentInvoiceMutationVariables = Exact<{
  input: ReceivePaymentInvoiceInput;
}>;


export type ReceivePaymentInvoiceMutation = { __typename?: 'Mutation', receivePaymentInvoice?: { __typename?: 'BillingInvoice', id?: string | null } | null };

export type VoidInvoiceMutationVariables = Exact<{
  input: VoidInvoiceInput;
}>;


export type VoidInvoiceMutation = { __typename?: 'Mutation', voidInvoice?: { __typename?: 'BillingInvoice', id?: string | null } | null };

export type SendInvoiceMutationVariables = Exact<{
  input: SendInvoiceInput;
}>;


export type SendInvoiceMutation = { __typename?: 'Mutation', sendInvoice?: { __typename?: 'BillingInvoice', id?: string | null } | null };

export type ProjectPageTaskFragmentFragment = { __typename?: 'Task', id: string, name?: string | null, startDate?: any | null, endDate?: any | null, projectedCost?: number | null, priority?: TaskPriorityType | null, plannedEffort?: number | null, dueReminder?: any | null, posY?: number | null, archived?: boolean | null, actualStart?: any | null, actualEnd?: any | null, actualCost?: number | null, customValues?: Array<{ __typename?: 'TaskCustomValue', value?: string | null, group?: { __typename?: 'ProjectGroup', id?: string | null } | null, attribute?: { __typename?: 'ProjectGroupCustomAttribute', id?: string | null, name?: string | null, type?: ProjectGroupCustomAttributeType | null } | null } | null> | null, parentTask?: { __typename?: 'Task', id: string } | null, projectStatus?: { __typename?: 'ProjectStatus', id?: string | null, name?: string | null, color?: string | null } | null, group?: { __typename?: 'ProjectGroup', id?: string | null, name?: string | null, customColumns?: Array<{ __typename?: 'ProjectGroupCustomColumn', enabled?: boolean | null, attribute?: { __typename?: 'ProjectGroupCustomAttribute', id?: string | null, name?: string | null, type?: ProjectGroupCustomAttributeType | null } | null } | null> | null } | null, comments?: Array<{ __typename?: 'TaskComment', id: string } | null> | null, attachments?: Array<{ __typename?: 'TaskAttachment', id: string } | null> | null, members?: Array<{ __typename?: 'TaskMember', id: string, companyMember?: { __typename?: 'CompanyMember', id: string } | null, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null> | null, watchers?: Array<{ __typename?: 'TaskWatcher', companyMember?: { __typename?: 'CompanyMember', id: string } | null } | null> | null, pics?: Array<{ __typename?: 'TaskPic', id: string, contact?: { __typename?: 'Contact', id: string } | null, pic?: { __typename?: 'ContactPic', id: string } | null } | null> | null, tags?: Array<{ __typename?: 'Tag', id?: string | null } | null> | null, templateTask?: { __typename?: 'TaskTemplate', id?: string | null, isRecurring?: boolean | null, recurringSetting?: { __typename?: 'TaskTemplateRecurringSetting', intervalType?: string | null, day?: number | null, month?: number | null, skipWeekend?: boolean | null } | null } | null };

export type ProjectPageQueryVariables = Exact<{
  projectId: Scalars['ID'];
  filters?: InputMaybe<FilterOptions>;
  companyId: Scalars['ID'];
  companyMemberId: Scalars['ID'];
}>;


export type ProjectPageQuery = { __typename?: 'Query', project?: { __typename?: 'TaskBoard', id?: string | null, name?: string | null, visibility?: CommonVisibility | null, description?: string | null, members?: Array<{ __typename?: 'TaskMember', id: string, companyMember?: { __typename?: 'CompanyMember', id: string } | null, user?: { __typename?: 'User', name?: string | null, email?: string | null } | null } | null> | null, workspace?: { __typename?: 'Workspace', id?: string | null } | null, groups?: Array<{ __typename?: 'ProjectGroup', id?: string | null, name?: string | null, ordering?: number | null, customColumns?: Array<{ __typename?: 'ProjectGroupCustomColumn', enabled?: boolean | null, attribute?: { __typename?: 'ProjectGroupCustomAttribute', id?: string | null, name?: string | null, type?: ProjectGroupCustomAttributeType | null } | null } | null> | null } | null> | null, projectSettings?: { __typename?: 'ProjectSettings', columns?: any | null } | null, projectStatuses?: Array<{ __typename?: 'ProjectStatus', id?: string | null, color?: string | null, name?: string | null, notify?: boolean | null } | null> | null, owners?: Array<{ __typename?: 'TaskBoardOwner', companyMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null } | null } | null } | null> | null, visibilityWhitelist?: { __typename?: 'CommonVisibilityWhitelist', teams?: Array<{ __typename?: 'CompanyTeam', id: string } | null> | null, members?: Array<{ __typename?: 'CompanyMember', id: string } | null> | null } | null, tasks?: Array<{ __typename?: 'Task', id: string, name?: string | null, startDate?: any | null, endDate?: any | null, projectedCost?: number | null, priority?: TaskPriorityType | null, plannedEffort?: number | null, dueReminder?: any | null, posY?: number | null, archived?: boolean | null, actualStart?: any | null, actualEnd?: any | null, actualCost?: number | null, childTasks?: Array<{ __typename?: 'Task', id: string, name?: string | null, startDate?: any | null, endDate?: any | null, projectedCost?: number | null, priority?: TaskPriorityType | null, plannedEffort?: number | null, dueReminder?: any | null, posY?: number | null, archived?: boolean | null, actualStart?: any | null, actualEnd?: any | null, actualCost?: number | null, parentTask?: { __typename?: 'Task', id: string, group?: { __typename?: 'ProjectGroup', id?: string | null, name?: string | null } | null } | null, customValues?: Array<{ __typename?: 'TaskCustomValue', value?: string | null, group?: { __typename?: 'ProjectGroup', id?: string | null } | null, attribute?: { __typename?: 'ProjectGroupCustomAttribute', id?: string | null, name?: string | null, type?: ProjectGroupCustomAttributeType | null } | null } | null> | null, projectStatus?: { __typename?: 'ProjectStatus', id?: string | null, name?: string | null, color?: string | null } | null, group?: { __typename?: 'ProjectGroup', id?: string | null, name?: string | null, customColumns?: Array<{ __typename?: 'ProjectGroupCustomColumn', enabled?: boolean | null, attribute?: { __typename?: 'ProjectGroupCustomAttribute', id?: string | null, name?: string | null, type?: ProjectGroupCustomAttributeType | null } | null } | null> | null } | null, comments?: Array<{ __typename?: 'TaskComment', id: string } | null> | null, attachments?: Array<{ __typename?: 'TaskAttachment', id: string } | null> | null, members?: Array<{ __typename?: 'TaskMember', id: string, companyMember?: { __typename?: 'CompanyMember', id: string } | null, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null> | null, watchers?: Array<{ __typename?: 'TaskWatcher', companyMember?: { __typename?: 'CompanyMember', id: string } | null } | null> | null, pics?: Array<{ __typename?: 'TaskPic', id: string, contact?: { __typename?: 'Contact', id: string } | null, pic?: { __typename?: 'ContactPic', id: string } | null } | null> | null, tags?: Array<{ __typename?: 'Tag', id?: string | null } | null> | null, templateTask?: { __typename?: 'TaskTemplate', id?: string | null, isRecurring?: boolean | null, recurringSetting?: { __typename?: 'TaskTemplateRecurringSetting', intervalType?: string | null, day?: number | null, month?: number | null, skipWeekend?: boolean | null } | null } | null } | null> | null, customValues?: Array<{ __typename?: 'TaskCustomValue', value?: string | null, group?: { __typename?: 'ProjectGroup', id?: string | null } | null, attribute?: { __typename?: 'ProjectGroupCustomAttribute', id?: string | null, name?: string | null, type?: ProjectGroupCustomAttributeType | null } | null } | null> | null, parentTask?: { __typename?: 'Task', id: string } | null, projectStatus?: { __typename?: 'ProjectStatus', id?: string | null, name?: string | null, color?: string | null } | null, group?: { __typename?: 'ProjectGroup', id?: string | null, name?: string | null, customColumns?: Array<{ __typename?: 'ProjectGroupCustomColumn', enabled?: boolean | null, attribute?: { __typename?: 'ProjectGroupCustomAttribute', id?: string | null, name?: string | null, type?: ProjectGroupCustomAttributeType | null } | null } | null> | null } | null, comments?: Array<{ __typename?: 'TaskComment', id: string } | null> | null, attachments?: Array<{ __typename?: 'TaskAttachment', id: string } | null> | null, members?: Array<{ __typename?: 'TaskMember', id: string, companyMember?: { __typename?: 'CompanyMember', id: string } | null, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null> | null, watchers?: Array<{ __typename?: 'TaskWatcher', companyMember?: { __typename?: 'CompanyMember', id: string } | null } | null> | null, pics?: Array<{ __typename?: 'TaskPic', id: string, contact?: { __typename?: 'Contact', id: string } | null, pic?: { __typename?: 'ContactPic', id: string } | null } | null> | null, tags?: Array<{ __typename?: 'Tag', id?: string | null } | null> | null, templateTask?: { __typename?: 'TaskTemplate', id?: string | null, isRecurring?: boolean | null, recurringSetting?: { __typename?: 'TaskTemplateRecurringSetting', intervalType?: string | null, day?: number | null, month?: number | null, skipWeekend?: boolean | null } | null } | null } | null> | null, createdBy?: { __typename?: 'User', id?: string | null } | null } | null, tagGroups?: Array<{ __typename?: 'TagGroup', id?: string | null, name?: string | null, tags?: Array<{ __typename?: 'Tag', id?: string | null, name?: string | null } | null> | null } | null> | null, contacts?: Array<{ __typename?: 'Contact', id: string, name?: string | null, pics?: Array<{ __typename?: 'ContactPic', id: string, name?: string | null } | null> | null } | null> | null, companyTeams?: Array<{ __typename?: 'CompanyTeam', id: string, title?: string | null } | null> | null, getTimesheetsByCompanyMember?: Array<{ __typename?: 'Timesheet', id: string, startDate?: any | null, endDate?: any | null, activity?: { __typename?: 'TimesheetActivity', task?: { __typename?: 'Task', id: string } | null } | null } | null> | null, tasks?: Array<{ __typename?: 'Task', id: string, name?: string | null } | null> | null, billingInvoices?: Array<{ __typename?: 'BillingInvoice', id?: string | null, docNo?: string | null, docDate?: any | null, terms?: number | null, totalDiscounted?: number | null, totalTaxed?: number | null, totalReceived?: number | null, void?: boolean | null, contactPic?: { __typename?: 'ContactPic', id: string, name?: string | null, contact?: { __typename?: 'Contact', id: string } | null } | null, items?: Array<{ __typename?: 'BillingInvoiceItem', id?: string | null, unitPrice?: number | null, discountPercentage?: number | null, taxPercentage?: number | null, itemName?: string | null, billed?: number | null, task?: { __typename?: 'Task', id: string, name?: string | null } | null } | null> | null } | null> | null };

export type CreateProjectGroupMutationVariables = Exact<{
  input: CreateProjectGroupInput;
}>;


export type CreateProjectGroupMutation = { __typename?: 'Mutation', createProjectGroup?: { __typename?: 'ProjectGroup', id?: string | null } | null };

export type EditProjectGroupMutationVariables = Exact<{
  input: EditProjectGroupInput;
}>;


export type EditProjectGroupMutation = { __typename?: 'Mutation', editProjectGroup?: { __typename?: 'ProjectGroup', id?: string | null } | null };

export type DeleteTasksMutationVariables = Exact<{
  taskIds: Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>;
}>;


export type DeleteTasksMutation = { __typename?: 'Mutation', deleteTasks?: Array<{ __typename?: 'Task', id: string } | null> | null };

export type ArchiveTasksMutationVariables = Exact<{
  input: ArchiveTaskInput;
}>;


export type ArchiveTasksMutation = { __typename?: 'Mutation', archiveTasks?: Array<{ __typename?: 'Task', id: string } | null> | null };

export type StopMemberActivityTrackerMutationVariables = Exact<{
  memberId: Scalars['ID'];
}>;


export type StopMemberActivityTrackerMutation = { __typename?: 'Mutation', stopMemberActivityTracker?: { __typename?: 'Timesheet', id: string } | null };

export type MoveTasksMutationVariables = Exact<{
  input: MoveTasksInput;
}>;


export type MoveTasksMutation = { __typename?: 'Mutation', moveTasks?: Array<{ __typename?: 'Task', id: string } | null> | null };

export type DuplicateTasksMutationVariables = Exact<{
  input: DuplicateTasksInput;
}>;


export type DuplicateTasksMutation = { __typename?: 'Mutation', duplicateTasks?: Array<{ __typename?: 'Task', id: string } | null> | null };

export type ImportTasksMutationVariables = Exact<{
  input: ImportTasksInput;
}>;


export type ImportTasksMutation = { __typename?: 'Mutation', importTasks?: { __typename?: 'ImportTasksResponse', imported?: number | null, failed?: number | null } | null };

export type UpdateTaskParentMutationVariables = Exact<{
  input: UpdateTaskParentInput;
}>;


export type UpdateTaskParentMutation = { __typename?: 'Mutation', updateTaskParent?: { __typename?: 'UpdateTaskParentResponse', sourceTask: { __typename?: 'Task', id: string } } | null };

export type ChangeTaskPositionMutationVariables = Exact<{
  input: ChangeTaskPositionInput;
}>;


export type ChangeTaskPositionMutation = { __typename?: 'Mutation', changeTaskPosition?: { __typename?: 'Task', id: string } | null };

export type DeleteProjectGroupsMutationVariables = Exact<{
  input: DeleteProjectGroupInput;
}>;


export type DeleteProjectGroupsMutation = { __typename?: 'Mutation', deleteProjectGroups?: Array<{ __typename?: 'ProjectGroup', id?: string | null } | null> | null };

export type MoveTaskToMemberProjectPageMutationVariables = Exact<{
  input: MoveTaskToMemberInput;
}>;


export type MoveTaskToMemberProjectPageMutation = { __typename?: 'Mutation', moveTaskToMember?: { __typename?: 'Task', id: string } | null };

export type CreateCustomColumnForGroupProjectPageMutationVariables = Exact<{
  input: CreateCustomColumnForGroupInput;
}>;


export type CreateCustomColumnForGroupProjectPageMutation = { __typename?: 'Mutation', createCustomColumnForGroup?: { __typename?: 'ProjectGroupCustomColumn', group?: { __typename?: 'ProjectGroup', id?: string | null } | null } | null };

export type EditCustomColumnForGroupProjectPageMutationVariables = Exact<{
  input: EditCustomColumnForGroupInput;
}>;


export type EditCustomColumnForGroupProjectPageMutation = { __typename?: 'Mutation', editCustomColumnForGroup?: { __typename?: 'ProjectGroupCustomColumn', group?: { __typename?: 'ProjectGroup', id?: string | null } | null } | null };

export type DeleteCustomColumnForGroupProjectPageMutationVariables = Exact<{
  input: DeleteCustomColumnForGroupInput;
}>;


export type DeleteCustomColumnForGroupProjectPageMutation = { __typename?: 'Mutation', deleteCustomColumnForGroup?: { __typename?: 'ProjectGroupCustomColumn', group?: { __typename?: 'ProjectGroup', id?: string | null } | null } | null };

export type ToggleCustomColumnProjectPageMutationVariables = Exact<{
  input: ToggleEnabledCustomColumnInput;
}>;


export type ToggleCustomColumnProjectPageMutation = { __typename?: 'Mutation', toggleEnabledCustomColumn?: { __typename?: 'ProjectGroupCustomColumn', attribute?: { __typename?: 'ProjectGroupCustomAttribute', id?: string | null } | null } | null };

export type ReorderGroupMutationProjectPageMutationVariables = Exact<{
  input: ReorderGroupInput;
}>;


export type ReorderGroupMutationProjectPageMutation = { __typename?: 'Mutation', reorderGroups?: Array<{ __typename?: 'ProjectGroup', id?: string | null } | null> | null };

export type AddCustomValueToProjectPageMutationVariables = Exact<{
  input: AddCustomValueToTaskInput;
}>;


export type AddCustomValueToProjectPageMutation = { __typename?: 'Mutation', addCustomValueToTask?: { __typename?: 'TaskCustomValue', value?: string | null } | null };

export type SharedTaskPageQueryVariables = Exact<{
  taskId: Scalars['ID'];
}>;


export type SharedTaskPageQuery = { __typename?: 'Query', task?: { __typename?: 'Task', id: string, name?: string | null, description?: string | null, startDate?: any | null, endDate?: any | null, projectedCost?: number | null, priority?: TaskPriorityType | null, plannedEffort?: number | null, dueReminder?: any | null, projectStatus?: { __typename?: 'ProjectStatus', id?: string | null, name?: string | null, color?: string | null } | null, project?: { __typename?: 'TaskBoard', id?: string | null, company?: { __typename?: 'Company', id?: string | null } | null, projectSettings?: { __typename?: 'ProjectSettings', columns?: any | null } | null, projectStatuses?: Array<{ __typename?: 'ProjectStatus', id?: string | null, name?: string | null, color?: string | null } | null> | null } | null, checklists?: Array<{ __typename?: 'Checklist', id: string, title?: string | null, checked?: boolean | null } | null> | null, comments?: Array<{ __typename?: 'TaskComment', id: string, message?: string | null, messageContent?: string | null, createdAt?: any | null, createdBy?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null, parentTaskComment?: { __typename?: 'TaskComment', id: string, messageContent?: string | null, message?: string | null, createdAt?: any | null, createdBy?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null, attachments?: Array<{ __typename?: 'TaskAttachment', id: string, name?: string | null, type?: string | null, url?: string | null, isExternal?: boolean | null, isDeleted?: boolean | null, createdBy?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null> | null } | null> | null, attachments?: Array<{ __typename?: 'TaskAttachment', id: string, name?: string | null, type?: string | null, createdAt?: any | null, url?: string | null, isExternal?: boolean | null, externalSource?: ExternalFileSource | null, createdBy?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null> | null, members?: Array<{ __typename?: 'TaskMember', id: string, companyMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null } | null> | null, watchers?: Array<{ __typename?: 'TaskWatcher', companyMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null } | null> | null, pics?: Array<{ __typename?: 'TaskPic', id: string, contact?: { __typename?: 'Contact', id: string } | null, pic?: { __typename?: 'ContactPic', id: string, name?: string | null } | null } | null> | null, tags?: Array<{ __typename?: 'Tag', id?: string | null, name?: string | null } | null> | null, templateTask?: { __typename?: 'TaskTemplate', id?: string | null, isRecurring?: boolean | null, recurringSetting?: { __typename?: 'TaskTemplateRecurringSetting', intervalType?: string | null, day?: number | null, month?: number | null, skipWeekend?: boolean | null } | null } | null } | null };

export type CreateChecklistMutationVariables = Exact<{
  taskId: Scalars['ID'];
  input: ChecklistInput;
}>;


export type CreateChecklistMutation = { __typename?: 'Mutation', createChecklist?: { __typename?: 'Checklist', id: string } | null };

export type UpdateChecklistMutationVariables = Exact<{
  checklistId: Scalars['ID'];
  input: ChecklistUpdateInput;
}>;


export type UpdateChecklistMutation = { __typename?: 'Mutation', updateChecklist?: { __typename?: 'Checklist', id: string } | null };

export type DeleteChecklistsMutationVariables = Exact<{
  checklistIds: Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>;
}>;


export type DeleteChecklistsMutation = { __typename?: 'Mutation', deleteChecklists?: Array<{ __typename?: 'Checklist', id: string } | null> | null };

export type UploadTaskAttachmentMutationVariables = Exact<{
  taskId: Scalars['ID'];
  attachment: Scalars['Upload'];
  commentId?: InputMaybe<Scalars['ID']>;
}>;


export type UploadTaskAttachmentMutation = { __typename?: 'Mutation', uploadTaskAttachment?: { __typename?: 'TaskAttachment', id: string } | null };

export type LinkExternalAttachmentsMutationVariables = Exact<{
  input: LinkExternalAttachmentsInput;
}>;


export type LinkExternalAttachmentsMutation = { __typename?: 'Mutation', linkExternalAttachments?: { __typename?: 'Task', id: string } | null };

export type PostTaskCommentMutationVariables = Exact<{
  input: PostCommentInput;
}>;


export type PostTaskCommentMutation = { __typename?: 'Mutation', postTaskComment?: { __typename?: 'TaskComment', id: string } | null };

export type UpdateTaskCommentMutationVariables = Exact<{
  taskCommentId: Scalars['ID'];
  input: TaskCommentUpdateInput;
}>;


export type UpdateTaskCommentMutation = { __typename?: 'Mutation', updateTaskComment?: { __typename?: 'TaskComment', id: string } | null };

export type DeleteTaskCommentMutationVariables = Exact<{
  taskCommentId: Scalars['ID'];
}>;


export type DeleteTaskCommentMutation = { __typename?: 'Mutation', deleteTaskComment?: { __typename?: 'TaskComment', id: string } | null };

export type LinkAttachmentToCommentMutationVariables = Exact<{
  input: LinkAttachmentToCommentInput;
}>;


export type LinkAttachmentToCommentMutation = { __typename?: 'Mutation', linkAttachmentToComment?: { __typename?: 'TaskComment', id: string } | null };

export type UnlinkAttachmentFromCommentMutationVariables = Exact<{
  input: LinkAttachmentToCommentInput;
}>;


export type UnlinkAttachmentFromCommentMutation = { __typename?: 'Mutation', unlinkAttachmentFromComment?: { __typename?: 'TaskComment', id: string, attachments?: Array<{ __typename?: 'TaskAttachment', id: string } | null> | null } | null };

export type TaskModalPageTaskFragmentFragment = { __typename?: 'Task', id: string, name?: string | null, startDate?: any | null, endDate?: any | null, actualStart?: any | null, actualEnd?: any | null, projectedValue?: number | null, actualValue?: number | null, plannedEffort?: number | null, actualEffort?: number | null, priority?: TaskPriorityType | null, dueReminder?: any | null, timeSpent?: number | null, approvedCost?: number | null, visibility?: CommonVisibility | null, customValues?: Array<{ __typename?: 'TaskCustomValue', value?: string | null, attribute?: { __typename?: 'ProjectGroupCustomAttribute', id?: string | null } | null } | null> | null, project?: { __typename?: 'TaskBoard', groups?: Array<{ __typename?: 'ProjectGroup', id?: string | null, name?: string | null, customColumns?: Array<{ __typename?: 'ProjectGroupCustomColumn', enabled?: boolean | null, attribute?: { __typename?: 'ProjectGroupCustomAttribute', id?: string | null, name?: string | null, type?: ProjectGroupCustomAttributeType | null } | null } | null> | null } | null> | null } | null, createdBy?: { __typename?: 'User', id?: string | null } | null, visibilityWhitelist?: { __typename?: 'CommonVisibilityWhitelist', teams?: Array<{ __typename?: 'CompanyTeam', id: string } | null> | null, members?: Array<{ __typename?: 'CompanyMember', id: string } | null> | null } | null, projectStatus?: { __typename?: 'ProjectStatus', id?: string | null, name?: string | null, color?: string | null } | null, checklists?: Array<{ __typename?: 'Checklist', id: string, title?: string | null, checked?: boolean | null } | null> | null, comments?: Array<{ __typename?: 'TaskComment', id: string } | null> | null, attachments?: Array<{ __typename?: 'TaskAttachment', id: string } | null> | null, members?: Array<{ __typename?: 'TaskMember', id: string, companyMember?: { __typename?: 'CompanyMember', id: string } | null } | null> | null, watchers?: Array<{ __typename?: 'TaskWatcher', companyMember?: { __typename?: 'CompanyMember', id: string } | null } | null> | null, pics?: Array<{ __typename?: 'TaskPic', id: string, contact?: { __typename?: 'Contact', id: string } | null, pic?: { __typename?: 'ContactPic', id: string } | null } | null> | null, tags?: Array<{ __typename?: 'Tag', id?: string | null } | null> | null, templateTask?: { __typename?: 'TaskTemplate', id?: string | null, isRecurring?: boolean | null, recurringSetting?: { __typename?: 'TaskTemplateRecurringSetting', intervalType?: string | null, day?: number | null, month?: number | null, skipWeekend?: boolean | null } | null } | null };

export type TaskModalPageQueryVariables = Exact<{
  taskId: Scalars['ID'];
  companyId: Scalars['ID'];
  companyMemberId: Scalars['ID'];
}>;


export type TaskModalPageQuery = { __typename?: 'Query', task?: { __typename?: 'Task', description?: string | null, id: string, name?: string | null, startDate?: any | null, endDate?: any | null, actualStart?: any | null, actualEnd?: any | null, projectedValue?: number | null, actualValue?: number | null, plannedEffort?: number | null, actualEffort?: number | null, priority?: TaskPriorityType | null, dueReminder?: any | null, timeSpent?: number | null, approvedCost?: number | null, visibility?: CommonVisibility | null, parentTask?: { __typename?: 'Task', id: string, name?: string | null } | null, childTasks?: Array<{ __typename?: 'Task', archived?: boolean | null, id: string, name?: string | null, startDate?: any | null, endDate?: any | null, actualStart?: any | null, actualEnd?: any | null, projectedValue?: number | null, actualValue?: number | null, plannedEffort?: number | null, actualEffort?: number | null, priority?: TaskPriorityType | null, dueReminder?: any | null, timeSpent?: number | null, approvedCost?: number | null, visibility?: CommonVisibility | null, customValues?: Array<{ __typename?: 'TaskCustomValue', value?: string | null, attribute?: { __typename?: 'ProjectGroupCustomAttribute', id?: string | null } | null } | null> | null, project?: { __typename?: 'TaskBoard', groups?: Array<{ __typename?: 'ProjectGroup', id?: string | null, name?: string | null, customColumns?: Array<{ __typename?: 'ProjectGroupCustomColumn', enabled?: boolean | null, attribute?: { __typename?: 'ProjectGroupCustomAttribute', id?: string | null, name?: string | null, type?: ProjectGroupCustomAttributeType | null } | null } | null> | null } | null> | null } | null, createdBy?: { __typename?: 'User', id?: string | null } | null, visibilityWhitelist?: { __typename?: 'CommonVisibilityWhitelist', teams?: Array<{ __typename?: 'CompanyTeam', id: string } | null> | null, members?: Array<{ __typename?: 'CompanyMember', id: string } | null> | null } | null, projectStatus?: { __typename?: 'ProjectStatus', id?: string | null, name?: string | null, color?: string | null } | null, checklists?: Array<{ __typename?: 'Checklist', id: string, title?: string | null, checked?: boolean | null } | null> | null, comments?: Array<{ __typename?: 'TaskComment', id: string } | null> | null, attachments?: Array<{ __typename?: 'TaskAttachment', id: string } | null> | null, members?: Array<{ __typename?: 'TaskMember', id: string, companyMember?: { __typename?: 'CompanyMember', id: string } | null } | null> | null, watchers?: Array<{ __typename?: 'TaskWatcher', companyMember?: { __typename?: 'CompanyMember', id: string } | null } | null> | null, pics?: Array<{ __typename?: 'TaskPic', id: string, contact?: { __typename?: 'Contact', id: string } | null, pic?: { __typename?: 'ContactPic', id: string } | null } | null> | null, tags?: Array<{ __typename?: 'Tag', id?: string | null } | null> | null, templateTask?: { __typename?: 'TaskTemplate', id?: string | null, isRecurring?: boolean | null, recurringSetting?: { __typename?: 'TaskTemplateRecurringSetting', intervalType?: string | null, day?: number | null, month?: number | null, skipWeekend?: boolean | null } | null } | null } | null> | null, project?: { __typename?: 'TaskBoard', id?: string | null, company?: { __typename?: 'Company', id?: string | null } | null, projectSettings?: { __typename?: 'ProjectSettings', columns?: any | null } | null, projectStatuses?: Array<{ __typename?: 'ProjectStatus', id?: string | null, name?: string | null, color?: string | null } | null> | null, workspace?: { __typename?: 'Workspace', id?: string | null } | null, groups?: Array<{ __typename?: 'ProjectGroup', id?: string | null, name?: string | null, customColumns?: Array<{ __typename?: 'ProjectGroupCustomColumn', enabled?: boolean | null, attribute?: { __typename?: 'ProjectGroupCustomAttribute', id?: string | null, name?: string | null, type?: ProjectGroupCustomAttributeType | null } | null } | null> | null } | null> | null } | null, comments?: Array<{ __typename?: 'TaskComment', id: string, message?: string | null, messageContent?: string | null, createdAt?: any | null, createdBy?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null, parentTaskComment?: { __typename?: 'TaskComment', id: string, messageContent?: string | null, message?: string | null, createdAt?: any | null, createdBy?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null, attachments?: Array<{ __typename?: 'TaskAttachment', id: string, name?: string | null, type?: string | null, url?: string | null, isExternal?: boolean | null, isDeleted?: boolean | null, createdBy?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null> | null } | null> | null, attachments?: Array<{ __typename?: 'TaskAttachment', id: string, name?: string | null, type?: string | null, createdAt?: any | null, url?: string | null, isExternal?: boolean | null, externalSource?: ExternalFileSource | null, createdBy?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null> | null, members?: Array<{ __typename?: 'TaskMember', id: string, companyMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null } | null> | null, pics?: Array<{ __typename?: 'TaskPic', id: string, pic?: { __typename?: 'ContactPic', id: string, name?: string | null } | null, contact?: { __typename?: 'Contact', id: string } | null } | null> | null, taskActivities?: Array<{ __typename?: 'TaskActivity', id: string, actionType?: string | null, fromDate?: any | null, toDate?: any | null, createdAt?: any | null, createdBy?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null, targetPic?: { __typename?: 'ContactPic', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null } | null } | null, targetMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null } | null } | null, attachment?: { __typename?: 'TaskAttachment', id: string, name?: string | null } | null, toCardStatus?: { __typename?: 'CompanyTeamStatus', id: string, label?: string | null } | null } | null> | null, customValues?: Array<{ __typename?: 'TaskCustomValue', value?: string | null, attribute?: { __typename?: 'ProjectGroupCustomAttribute', id?: string | null } | null } | null> | null, createdBy?: { __typename?: 'User', id?: string | null } | null, visibilityWhitelist?: { __typename?: 'CommonVisibilityWhitelist', teams?: Array<{ __typename?: 'CompanyTeam', id: string } | null> | null, members?: Array<{ __typename?: 'CompanyMember', id: string } | null> | null } | null, projectStatus?: { __typename?: 'ProjectStatus', id?: string | null, name?: string | null, color?: string | null } | null, checklists?: Array<{ __typename?: 'Checklist', id: string, title?: string | null, checked?: boolean | null } | null> | null, watchers?: Array<{ __typename?: 'TaskWatcher', companyMember?: { __typename?: 'CompanyMember', id: string } | null } | null> | null, tags?: Array<{ __typename?: 'Tag', id?: string | null } | null> | null, templateTask?: { __typename?: 'TaskTemplate', id?: string | null, isRecurring?: boolean | null, recurringSetting?: { __typename?: 'TaskTemplateRecurringSetting', intervalType?: string | null, day?: number | null, month?: number | null, skipWeekend?: boolean | null } | null } | null } | null, companyTeams?: Array<{ __typename?: 'CompanyTeam', id: string, title?: string | null } | null> | null, company?: { __typename?: 'Company', id?: string | null, activeSubscription?: Array<{ __typename?: 'CompanySubscription', id: string, type?: PackageTypes | null, whiteListedMembers?: { __typename?: 'SubscriptionQuantityResult', companyMembers?: Array<{ __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null } | null } | null> | null } | null } | null> | null } | null, tagGroups?: Array<{ __typename?: 'TagGroup', id?: string | null, name?: string | null, tags?: Array<{ __typename?: 'Tag', id?: string | null, name?: string | null } | null> | null } | null> | null, contacts?: Array<{ __typename?: 'Contact', id: string, name?: string | null, pics?: Array<{ __typename?: 'ContactPic', id: string, name?: string | null } | null> | null } | null> | null, getTimesheetsByCompanyMember?: Array<{ __typename?: 'Timesheet', id: string, startDate?: any | null, endDate?: any | null, activity?: { __typename?: 'TimesheetActivity', task?: { __typename?: 'Task', id: string } | null } | null } | null> | null, tasks?: Array<{ __typename?: 'Task', id: string, name?: string | null } | null> | null };

export type RemoveFromTaskVisibilityWhitelistMutationVariables = Exact<{
  input: RemoveFromTaskVisibilityWhitelistInput;
}>;


export type RemoveFromTaskVisibilityWhitelistMutation = { __typename?: 'Mutation', removeFromTaskVisibilityWhitelist?: { __typename?: 'Task', id: string } | null };

export type SetTaskVisibilityMutationVariables = Exact<{
  input: SetTaskVisibilityInput;
}>;


export type SetTaskVisibilityMutation = { __typename?: 'Mutation', setTaskVisibility?: { __typename?: 'Task', id: string } | null };

export type AddToTaskVisibilityWhitelistMutationVariables = Exact<{
  input: AddToTaskVisibilityWhitelistInput;
}>;


export type AddToTaskVisibilityWhitelistMutation = { __typename?: 'Mutation', addToTaskVisibilityWhitelist?: { __typename?: 'Task', id: string } | null };

export type AddCustomValueToTaskModalMutationVariables = Exact<{
  input: AddCustomValueToTaskInput;
}>;


export type AddCustomValueToTaskModalMutation = { __typename?: 'Mutation', addCustomValueToTask?: { __typename?: 'TaskCustomValue', value?: string | null } | null };

export type ToggleCustomColumnTaskModalPageMutationVariables = Exact<{
  input: ToggleEnabledCustomColumnInput;
}>;


export type ToggleCustomColumnTaskModalPageMutation = { __typename?: 'Mutation', toggleEnabledCustomColumn?: { __typename?: 'ProjectGroupCustomColumn', attribute?: { __typename?: 'ProjectGroupCustomAttribute', id?: string | null } | null } | null };

export type CreateCustomColumnForGroupTaskModalMutationVariables = Exact<{
  input: CreateCustomColumnForGroupInput;
}>;


export type CreateCustomColumnForGroupTaskModalMutation = { __typename?: 'Mutation', createCustomColumnForGroup?: { __typename?: 'ProjectGroupCustomColumn', group?: { __typename?: 'ProjectGroup', id?: string | null } | null } | null };

export type WorkspaceArchivedProjectsPageQueryVariables = Exact<{
  workspaceId: Scalars['ID'];
}>;


export type WorkspaceArchivedProjectsPageQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', id?: string | null, name?: string | null, projects?: Array<{ __typename?: 'TaskBoard', id?: string | null, name?: string | null, archived?: boolean | null, archivedAt?: any | null, archivedBy?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null } | null } | null> | null } | null };

export type WorkspacePageTaskFragmentFragment = { __typename?: 'Task', id: string, name?: string | null, archived?: boolean | null, startDate?: any | null, endDate?: any | null, priority?: TaskPriorityType | null, projectStatus?: { __typename?: 'ProjectStatus', id?: string | null, color?: string | null } | null, members?: Array<{ __typename?: 'TaskMember', id: string, companyMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null } | null> | null, pics?: Array<{ __typename?: 'TaskPic', id: string, pic?: { __typename?: 'ContactPic', id: string, name?: string | null } | null } | null> | null, watchers?: Array<{ __typename?: 'TaskWatcher', companyMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null } | null> | null, attachments?: Array<{ __typename?: 'TaskAttachment', id: string } | null> | null, comments?: Array<{ __typename?: 'TaskComment', id: string } | null> | null };

export type WorkspacePageQueryVariables = Exact<{
  workspaceId: Scalars['ID'];
}>;


export type WorkspacePageQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', id?: string | null, name?: string | null, projects?: Array<{ __typename?: 'TaskBoard', id?: string | null, name?: string | null, archived?: boolean | null, projectStatuses?: Array<{ __typename?: 'ProjectStatus', id?: string | null, color?: string | null, name?: string | null } | null> | null, groups?: Array<{ __typename?: 'ProjectGroup', id?: string | null, name?: string | null, tasks?: Array<{ __typename?: 'Task', id: string, name?: string | null, archived?: boolean | null, startDate?: any | null, endDate?: any | null, priority?: TaskPriorityType | null, childTasks?: Array<{ __typename?: 'Task', id: string, name?: string | null, archived?: boolean | null, startDate?: any | null, endDate?: any | null, priority?: TaskPriorityType | null, projectStatus?: { __typename?: 'ProjectStatus', id?: string | null, color?: string | null } | null, members?: Array<{ __typename?: 'TaskMember', id: string, companyMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null } | null> | null, pics?: Array<{ __typename?: 'TaskPic', id: string, pic?: { __typename?: 'ContactPic', id: string, name?: string | null } | null } | null> | null, watchers?: Array<{ __typename?: 'TaskWatcher', companyMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null } | null> | null, attachments?: Array<{ __typename?: 'TaskAttachment', id: string } | null> | null, comments?: Array<{ __typename?: 'TaskComment', id: string } | null> | null } | null> | null, projectStatus?: { __typename?: 'ProjectStatus', id?: string | null, color?: string | null } | null, members?: Array<{ __typename?: 'TaskMember', id: string, companyMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null } | null> | null, pics?: Array<{ __typename?: 'TaskPic', id: string, pic?: { __typename?: 'ContactPic', id: string, name?: string | null } | null } | null> | null, watchers?: Array<{ __typename?: 'TaskWatcher', companyMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null, profileImage?: string | null } | null } | null } | null> | null, attachments?: Array<{ __typename?: 'TaskAttachment', id: string } | null> | null, comments?: Array<{ __typename?: 'TaskComment', id: string } | null> | null } | null> | null } | null> | null } | null> | null } | null };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, onboarding?: any | null, profileImage?: string | null, createdAt?: any | null, signUpData?: any | null, companies?: Array<{ __typename?: 'Company', id?: string | null, name?: string | null, logoUrl?: string | null, settings?: string | null, defaultTimezone?: string | null, slug?: string | null, members?: Array<{ __typename?: 'CompanyMember', id: string, type?: CompanyMemberType | null, active?: boolean | null, teams?: Array<{ __typename?: 'CompanyTeam', id: string, title?: string | null, members?: Array<{ __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null } | null } | null> | null } | null> | null, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null> | null, currentSubscription?: { __typename?: 'Subscription', id: string, invoiceQuota?: number | null, reportQuota?: number | null, storageQuota?: number | null, taskQuota?: number | null, teamQuota?: number | null, userQuota?: number | null, stripeSubscriptionId?: string | null, package?: { __typename?: 'SubscriptionPackage', id: string, name?: string | null, isCustom?: boolean | null, invoiceQuota?: number | null, reportQuota?: number | null, storageQuota?: number | null, taskQuota?: number | null, teamQuota?: number | null, userQuota?: number | null } | null } | null } | null> | null, defaultCompany?: { __typename?: 'Company', id?: string | null, name?: string | null, logoUrl?: string | null, settings?: string | null, defaultTimezone?: string | null, slug?: string | null, members?: Array<{ __typename?: 'CompanyMember', id: string, type?: CompanyMemberType | null, active?: boolean | null, teams?: Array<{ __typename?: 'CompanyTeam', id: string, title?: string | null, members?: Array<{ __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null } | null } | null> | null } | null> | null, user?: { __typename?: 'User', id?: string | null, name?: string | null, email?: string | null, profileImage?: string | null } | null } | null> | null, currentSubscription?: { __typename?: 'Subscription', id: string, invoiceQuota?: number | null, reportQuota?: number | null, storageQuota?: number | null, taskQuota?: number | null, teamQuota?: number | null, userQuota?: number | null, stripeSubscriptionId?: string | null, package?: { __typename?: 'SubscriptionPackage', id: string, name?: string | null, isCustom?: boolean | null, invoiceQuota?: number | null, reportQuota?: number | null, storageQuota?: number | null, taskQuota?: number | null, teamQuota?: number | null, userQuota?: number | null } | null } | null } | null, stripeCustomerDetails?: { __typename?: 'StripeCustomerDetails', id?: string | null, default_currency?: string | null } | null } | null };

export type WorkspaceStoreQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type WorkspaceStoreQuery = { __typename?: 'Query', workspaces?: Array<{ __typename?: 'Workspace', id?: string | null, name?: string | null, bgColor?: string | null, visibility?: CommonVisibility | null, projects?: Array<{ __typename?: 'TaskBoard', id?: string | null, name?: string | null, visibility?: CommonVisibility | null, archived?: boolean | null, members?: Array<{ __typename?: 'TaskMember', id: string, user?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null } | null } | null> | null, projectSettings?: { __typename?: 'ProjectSettings', columns?: any | null } | null, groups?: Array<{ __typename?: 'ProjectGroup', id?: string | null, name?: string | null } | null> | null, projectStatuses?: Array<{ __typename?: 'ProjectStatus', id?: string | null, color?: string | null, name?: string | null, notify?: boolean | null } | null> | null, owners?: Array<{ __typename?: 'TaskBoardOwner', companyMember?: { __typename?: 'CompanyMember', id: string, user?: { __typename?: 'User', id?: string | null } | null } | null } | null> | null, visibilityWhitelist?: { __typename?: 'CommonVisibilityWhitelist', teams?: Array<{ __typename?: 'CompanyTeam', id: string } | null> | null, members?: Array<{ __typename?: 'CompanyMember', id: string } | null> | null } | null, createdBy?: { __typename?: 'User', id?: string | null } | null } | null> | null, visibilityWhitelist?: { __typename?: 'CommonVisibilityWhitelist', teams?: Array<{ __typename?: 'CompanyTeam', id: string } | null> | null, members?: Array<{ __typename?: 'CompanyMember', id: string } | null> | null } | null, createdBy?: { __typename?: 'User', id?: string | null } | null } | null> | null };
