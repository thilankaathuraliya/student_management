namespace StudentManagement.Application.Common;

public static class PaginationConstants
{
    public const int DefaultPage = 1;
    public const int DefaultPageSize = 10;
    public const int MaxPageSize = 100;

    public static (int Page, int PageSize) Normalize(int page, int pageSize)
    {
        var p = page < 1 ? DefaultPage : page;
        var ps = pageSize < 1 ? DefaultPageSize : Math.Min(pageSize, MaxPageSize);
        return (p, ps);
    }
}
