import pandas as pd

# Script to filter out COVID-19 Data
# by: Lev Cesar Guzman Aparicio lguzm77@gmail.com

# ----------------------------METHODS------------------------------------------------------------------


# ------------------------------MAIN----------------------------------------------------------------------

def main():
    # first we will read the .csv file
    covid_df = pd.read_csv("./LATAM-JUNE-5-2020.csv")  # reads well

    # now we filter the continentExp column to only have "America Values"
    # first stage of filtering

    # first Step: create a boolean expression representing what we want to keep

    # boolean variable; selects all the rows that satisfy the condition
    is_from_americas = covid_df.continentExp.eq("America")  # another syntax
    # alternate syntax: is_from_americas = covid_df["continentExp"] = covid_df["continentExp"] == "America"
    # we will chain multible boolean variables
    not_latam = ["United_States_of_America", "Canada"]

    # to store the filtered data, save the new df in a new variable
    covid_df_americas = covid_df[is_from_americas & ~
                                 covid_df.countriesAndTerritories.isin(not_latam)]

    # now let us sort our df by date in ascending order
    # format in the original file is dd-mm-YYYY

    covid_df_americas['dateRep'] = pd.to_datetime(
        covid_df_americas[['day', 'month', 'year']])  # convert it to a datetime object for sorting

    # inplace has to be true for the sorting to be stored
    covid_df_americas.sort_values(by=['dateRep'], inplace=True)

    # now group the data by date and record the cases

    condensed_df_americas = covid_df_americas.groupby(by="dateRep").sum().cases

    # now let us write a new filtered .csv file
    covid_df_americas.to_csv("LATAM-JUNE-5-2020-filtered.csv")

    # filter all dates before Feb 28

    # create the threshold date
    before_date = pd.to_datetime('2020-02-28')

    # return a new dataframe with dates after Feb 28, 2020
    condensed_df_americas = condensed_df_americas[condensed_df_americas.index >= before_date]

    # write a new .csv file with columns dateRep,
    condensed_df_americas.to_csv("Condensed.csv")


main()
